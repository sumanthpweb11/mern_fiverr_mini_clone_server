import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  // res.send(payload);
  if (req.userId !== user?._id?.toString()) {
    return res
      .status(403)
      .send("you are not the correct logged in  user  you cannot delete");
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted");
};
