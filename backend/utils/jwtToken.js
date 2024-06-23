const savetoken = async function (user, res, status) {
  try {
    const token = await user.generateToken();
    console.log(token);

    res.cookie("token", token);
    const { password, ...filteredUser } = { ...user._doc };

    // console.log(filteredUser, password);
    return res
      .status(status)
      .json({ success: true, user: filteredUser, token });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
    });
  }
};

module.exports = savetoken;
