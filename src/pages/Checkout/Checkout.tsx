import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ICartProduct } from "../../interfaces/ICart";
import { useDeleteCart } from "../../hooks/actions/useCart";
import { useUpdateUser, useUserId } from "../../hooks/actions/useUser";

const checkoutSchema = z.object({
  name: z.string().min(1, "Recipient name is required"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Invalid phone"),
  email: z.string().email("Invalid email"),
  postalCode: z.string().min(1, "Postal code required"),
  address: z.string().min(1, "Street address required"),
  city: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["card", "cod"]),
  cardNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(val),
      "Card number must be in format 1234-5678-9012-3456"
    ),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { items, total, cartId } = state || {
    items: [],
    total: 0,
    cartId: null,
  };
  const { mutate: deleteCart } = useDeleteCart();
  const { mutate: updateUser } = useUpdateUser();
  const userId = useUserId();
  const [orderPlaced, setOrderPlaced] = useState(false);
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "card" },
  });

  const paymentMethod = watch("paymentMethod");
  const onSubmit = async (data: CheckoutForm) => {
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    try {
      await updateUser(
        {
          id: userId ?? 0,
          data: {
            address: {
              postalCode: data.postalCode,
              address: data.address,
              city: data.city,
            },
            phone: data.phone,
          },
        },
        {
          onSuccess: () => toast.success("User info updated!"),
          onError: () => toast.error("Failed to update user"),
        }
      );

      if (cartId) {
        await deleteCart(
          { cartId: cartId, userId: userId || 0 },
          {
            onSuccess: () => {
              toast.success("Order placed and cart cleared!");
            },
            onError: () => {
              toast.error("Failed to clear cart!");
            },
          }
        );
      }

      sessionStorage.removeItem("cart_items");

      toast.success("Order placed successfully!");
      setOrderPlaced(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Order failed!");
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. A confirmation email will be sent to you.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-2 space-y-6"
      >
        <div className="p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Shipping Information</h3>
          <input {...register("name")} placeholder="Name" className="input" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input {...register("phone")} placeholder="Phone" className="input" />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}

          <input {...register("email")} placeholder="Email" className="input" />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <input
            {...register("postalCode")}
            placeholder="Postal Code"
            className="input"
          />
          <input
            {...register("address")}
            placeholder="Address"
            className="input"
          />
          <input {...register("city")} placeholder="City" className="input" />
          <textarea
            {...register("note")}
            placeholder="Delivery Note"
            className="input"
          />
        </div>

        <div className="p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold text-lg">Payment Information</h3>
          <select {...register("paymentMethod")} className="input">
            <option value="card">Credit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          {paymentMethod === "card" && (
            <>
              <input
                {...register("cardNumber")}
                placeholder="Card Number (1234-5678-9012-3456)"
                className="input"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.match(/.{1,4}/g)?.join("-") || "";
                  e.target.value = value;
                }}
              />
              <input
                {...register("expiry")}
                placeholder="MM/YY"
                className="input"
              />
              <input {...register("cvv")} placeholder="CVV" className="input" />
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Place Order
        </button>
      </form>

      <div className="p-4 border rounded-lg bg-white h-fit">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        <ul className="space-y-3">
          {items.map((item: ICartProduct) => (
            <li key={item.id} className="flex gap-3 items-center">
              <img
                src={item.thumbnail || "https://via.placeholder.com/60"}
                alt={item.title}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ${item.price}
                </p>
              </div>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
