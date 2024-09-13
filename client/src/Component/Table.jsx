


import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Card, IconButton, Typography } from "@material-tailwind/react";

const Table = ({ trxn }) => {
  console.log(trxn);

  const TABLE_HEAD = ["Coin", "Type", "Amount", , "Token QTY" ,"Date & Time", "Price"];

  return (
    <Card className="max-h-[400px] font-poppins w-full bg-[#0d0d0d] border-[#666666] border max-w-[1300px] scrollbar overflow-y-scroll">
      <table className="w-full mx-auto table-auto relative text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="p-2 z-20 bg-black sticky top-0 border-b border-[#666666] pt-6"
              >
                <Typography
                  variant="small"
                  className="font-semibold text-[#9860FF] leading-none"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trxn.map((transaction, index) => {
            const { coin, type, amount, tokenQuantity,createdAt, price, user } = transaction;
            const formattedDate = new Date(createdAt).toLocaleString(); // Format the date and time
            const transactionHash = transaction._id; // Assuming `_id` as a transaction identifier

            return (
              <tr key={index}>
                <td className="p-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold text-[#CFC8C8]"
                  >
                    {coin.name} ({coin.ticker}) {/* Coin name and ticker */}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className={`font-normal ${
                      type === "buy" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {type} {/* Transaction type: 'buy' or 'sell' */}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {amount} {/* Transaction amount */}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {tokenQuantity.toFixed(4)} {/* Formatted date and time */}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {formattedDate} {/* Formatted date and time */}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {price} {/* Transaction price */}
                  </Typography>
                </td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default Table;

