require("dotenv").config();
const { User } = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

let payments =  async (req, res) => {
	try {
	let { amount, id } = req.body
	let userDtails = await User.findOne({_id:req.user.id})
    if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue"})

		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "bought chat any file plus",
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)

		userDtails.is_user_plus = true;
		userDtails.plus_expiry = Date.now() + 2629800000; // 1 month
		await userDtails.save()
		
		return res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		return res.json({
			error:error.message,
			message: "Payment failed",
			success: false
		})
	}
}

module.exports = {
    payments
  };