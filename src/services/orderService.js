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
    subject: `Đặt hàng thành công - Mã đơn hàng: #${order._id}`,
    text: `Cảm ơn bạn đã đặt hàng!\n\Đặt hàng ID: ${order._id}\nTổng giá: ${order.totalPrice}\nTrạng thái: ${order.status}`,
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
        <p><strong>Tổng:</strong> ${order.totalPrice.toLocaleString(
          "vi-VN"
        )} VNĐ</p>
        <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng của bạn đã được chuyển đi.</p>
        <p>Cảm ơn bạn đã mua sắm với chúng tôi!</p>
      </body>
    </html>`,
  };

  await transporter.sendMail(mailOptions);
};

// const createOrder = async (orderData) => {
//   const session = await Order.startSession();

//   try {
//     const result = await session.withTransaction(async () => {
//       await Promise.all(
//         orderData.items.map(async (item) => {
//           const product = await Product.findById(item.productId).session(
//             session
//           );

//           if (!product) {
//             throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
//           }

//           if (product.quantity - product.sold < item.quantity) {
//             throw new Error(`Không đủ hàng cho sản phẩm: ${product.title}`);
//           }

//           product.sold += item.quantity;
//           return product.save({ session });
//         }),
//       );

//       const order = new Order(orderData);
//       const savedOrder = await order.save({ session });
//       const detailOrder = await savedOrder.populate("user");

//       // await sendOrderConfirmationEmail(detailOrder);

//       const productIds = orderData.items.map((item) => item.productId);
//       // await Cart.findOneAndUpdate(
//       //   { userId: orderData.user },
//       //   { $pull: { items: { productId: { $in: productIds } } } },
//       //   { session, new: true }
//       // );

//       await Promise.all([
//         sendOrderConfirmationEmail(detailOrder),
//         Cart.findOneAndUpdate(
//           { userId: orderData.user },
//           { $pull: { items: { productId: { $in: productIds } } } },
//           { session, new: true }
//         ),
//       ]);

//       return savedOrder;
//     });

//     return result;
//   } catch (error) {
//     console.error("Error creating order:", error);
//     throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
//   } finally {
//     session.endSession();
//   }
// };

const createOrder = async (orderData) => {
  const session = await Order.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const productIds = orderData.items.map((item) => item.productId);

      const productUpdates = orderData.items.map(async (item) => {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        if (product.quantity - product.sold < item.quantity) {
          throw new Error(`Không đủ hàng cho sản phẩm: ${product.title}`);
        }

        product.sold += item.quantity;
        return product.save({ session });
      });

      const order = new Order(orderData);
      const [savedOrder] = await Promise.all([
        order.save({ session }),
        Promise.all(productUpdates),
      ]);

      const orderDetail = await savedOrder.populate("user");

      await Promise.all([
        sendOrderConfirmationEmail(orderDetail),
        Cart.findOneAndUpdate(
          { userId: orderData.user },
          { $pull: { items: { productId: { $in: productIds } } } },
          { session, new: true }
        ),
      ]);

      return savedOrder;
    });

    return result;
  } catch (error) {
    console.error("Error creating order:", error);
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
  console.log(orderId);
  try {
    const result = await session.withTransaction(async () => {
      const orderData = await Order.findByIdAndUpdate(
        orderId,
        { status: "canceled" },
        { new: true, session }
      );

      if (!orderData) {
        throw new Error(`Order with ID ${orderId} does not exist.`);
      }

      await Promise.all(
        orderData.items.map(async (item) => {
          const product = await Product.findById(item.productId).session(
            session
          );

          if (!product) {
            throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
          }

          product.sold -= item.quantity;
          return product.save({ session });
        })
      );

      return orderData;
    });
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Lỗi khi hủy đơn hàng: " + error.message);
  } finally {
    session.endSession();
  }
};

const updateStatusOrder = (orderId, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const data =
        status === "delivered" ? { status, paymentStatus: "paid" } : { status };

      const order = await Order.findByIdAndUpdate(orderId, data, { new: true });

      resolve(order);
    } catch (error) {
      reject("Lỗi khi cập nhật trạng thái  đơn hàng");
    }
  });

module.exports = {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  getAllOrder,
  updateStatusOrder,
};
