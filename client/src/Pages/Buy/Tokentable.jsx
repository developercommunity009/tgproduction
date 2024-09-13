
import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Card, IconButton, Typography } from "@material-tailwind/react";

// Helper function to truncate strings
const truncateString = (str, length = 10) => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...${str.slice(-length)}`;
};

const TABLE_HEAD = ["Account", "Type", "Amount", "Token QTY",  "Date & Time", "TraxHash"];

const Tokentable = ({ trads }) => {
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
          {trads.map(({ _id, user, type, amount ,tokenQuantity, createdAt }, index) => {
            const formattedDate = new Date(createdAt).toLocaleString(); // Format the date and time
            const shortAccount = truncateString(user.wallet, 6); // Shorten the wallet address
            const shortTraxHash = truncateString(_id, 6); // Shorten the transaction hash

            return (
              <tr key={index}>
                <td className="p-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold text-[#CFC8C8]"
                  >
                    {shortAccount}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className={`font-normal ${
                      type === "buy" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {type}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {amount}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {tokenQuantity}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="text-sm text-[#CFC8C8]"
                  >
                    {formattedDate}
                  </Typography>
                </td>
                <td className="p-1">
                  <Typography
                    variant="small"
                    className="font-normal text-[#CFC8C8]"
                  >
                    {shortTraxHash}
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

export default Tokentable;

