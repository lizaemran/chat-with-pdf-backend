require("dotenv").config();
const { User } = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

let payments =  async (req, res) => {
	try {
	let { amount, id } = req.body
	let userDtails = await User.findOne({_id:req.user.id})
    if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue",response: {}})

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
		
		return res.status(200).json({
			message: "Payment successful",
			response: {success: true}
		})
	} catch (error) {
		console.log("Error", error)
		return res.status(500).json({
			message: "Payment failed",
			response: {success: false,error:error.message}
		})
	}
}

module.exports = {
    payments
  };