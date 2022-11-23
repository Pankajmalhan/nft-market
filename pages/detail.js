import { ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import CountDown from "../components/CountDown";
import styles from "../styles/Details.module.css";

export default function DetailsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "30%",
          alignItems: "center",
          margin: "5rem",
          padding: "1rem",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1rem",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <img
          onClick={() => console.log("Hello")}
          className={styles.image}
          style={{
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16
            )}`,
          }}
          alt="example"
          src="https://joeschmoe.io/api/v1/random"
        />
      </div>
      <div
        style={{
          width: "50%",
          alignItems: "center",
          // border: "1px solid black",
          margin: "5rem",
          marginLeft: "-3rem",
          padding: "1rem",
          borderRadius: "1rem",
          justifyContent: "center",
          alignItems: "center",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <div className={styles.additional}>
          <p>
            <span className={styles.cardName}>John Doe</span>
          </p>
          <p className="price">
            <span className={styles.price}>Current Price: 20 Ethereum</span>
          </p>
          <CountDown />
        </div>
        <div className={styles.btnContainer}>
          <button
            className={
              "AddtoCart bg-gray-800 hover:bg-gray-400 text-white font-bold my-1 py-5 px-0 rounded-2xl w-4/12 m-6"
            }
          >
            <ShoppingCartOutlined style={{ fontSize: "1.5rem" }} /> Add to Cart
          </button>
          <button
            className={
              "buyNow bg-gray-800 hover:bg-gray-400 text-white font-bold my-1 py-5 px-0 rounded-2xl w-4/12 m-6"
            }
          >
            <DollarOutlined style={{ fontSize: "1.5rem" }} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
