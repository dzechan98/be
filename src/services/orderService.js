const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const transporter = require("../configs/emailTransporter");

const sendOrderConfirmationEmail = async (order) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.title} x ${item.quantity} - ${(
          item.price * item.quantity
        ).toLocaleString("vi-VN")} VNĐ</li>`
    )
    .join("");

  const mailOptions = {
    from: "VStore",
    to: order.user.email,
    subject: `Đặt hàng thành công - Mã đơn hàng: #${order.orderCode}`,
    text: `Cảm ơn bạn đã đặt hàng!\n\Đặt hàng ID: ${order.orderCode}`,
    html: `<html>
      <body>
        <h1>Đặt hàng thành công</h1>
        <p>Dear ${order.user.name}</p>
        <p>Cảm ơn bạn đã đặt hàng. Dưới đây là chi tiết đơn hàng:</p>
        <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
        <h2>Sản phẩm:</h2>
        <ul>
          ${itemsList}
        </ul>
        <p><strong>Phí vận chuyển:</strong> ${order.shippingFee.toLocaleString(
          "vi-VN"
        )} VNĐ</p>
        <p>
        <p><strong>Tổng:</strong> ${(
          order.totalPrice + order.shippingFee
        ).toLocaleString("vi-VN")} VNĐ</p>
        <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng của bạn đã được chuyển đi.</p>
        <p>Cảm ơn bạn đã mua sắm với chúng tôi!</p>
      </body>
    </html>`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const generateOrderCode = async (session) => {
  const lastOrder = await Order.findOne({})
    .sort({ createdAt: -1 })
    .session(session);

  const lastOrderNumber = lastOrder
    ? parseInt(lastOrder.orderCode.slice(2))
    : 0;

  const newOrderNumber = lastOrderNumber + 1;
  return `VD${newOrderNumber.toString().padStart(10, "0")}`;
};

const createOrder = async (orderData) => {
  const session = await Order.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const productUpdates = orderData.items.map(async (item) => {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        if (product.quantity - product.sold < item.quantity) {
          throw new Error(`Không đủ hàng cho sản phẩm: ${product.title}`);
        }

        return product.save({ session });
      });

      await Promise.all(productUpdates);

      const orderCode = await generateOrderCode(session);
      const order = new Order({ ...orderData, orderCode });
      const savedOrder = await order.save({ session });

      const orderDetail = await savedOrder.populate("user");

      return orderDetail;
    });

    await Promise.all([
      sendOrderConfirmationEmail(result),
      Cart.findOneAndUpdate(
        { userId: orderData.user },
        {
          $pull: {
            items: {
              productId: { $in: orderData.items.map((item) => item.productId) },
            },
          },
        },
        { new: true }
      ),
    ]);

    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  } finally {
    session.endSession();
  }
};

const getOrdersByUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

      resolve(orders);
    } catch (error) {
      reject("Lỗi khi lấy danh sách đơn hàng");
    }
  });

const getAllOrder = (page, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({})
        .populate("user")
        .populate("shippingAddress")
        .limit(limit)
        .skip((page - 1) * limit);

      const count = await Order.countDocuments();

      resolve({
        results: orders,
        count,
      });
    } catch (error) {
      reject("Lỗi khi nạp tất cả đơn hàng");
    }
  });

const cancelOrder = async (orderId) => {
  const session = await Order.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const orderData = await Order.findByIdAndUpdate(
        orderId,
        { status: "canceled", canceledDate: new Date() },
        { new: true, session }
      );

      return orderData;
    });
    return result;
  } catch (error) {
    throw new Error("Lỗi khi hủy đơn hàng: " + error.message);
  } finally {
    session.endSession();
  }
};

const updateStatusOrder = (orderId, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const data =
        status === "delivered"
          ? { status, paymentStatus: "paid", deliveredDate: new Date() }
          : { status };

      const order = await Order.findByIdAndUpdate(orderId, data, { new: true });

      if (status === "delivered") {
        await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId);

            if (!product) {
              throw new Error(
                `Sản phẩm với ID ${item.productId} không tồn tại`
              );
            }

            product.sold += item.quantity;
            return product.save();
          })
        );
      }

      resolve(order);
    } catch (error) {
      console.log(error);
      reject("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  });

module.exports = {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  getAllOrder,
  updateStatusOrder,
};
