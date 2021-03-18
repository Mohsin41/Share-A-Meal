const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const passportLocalMongoose = require('passport-local-mongoose')

const FoodAngelSchema = new mongoose.Schema({
  name: String,
  address: String,
  cellPhone: Number,
  availableMeal: {
    type: Number,
    default: 0,
  },
  beneficiaries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beneficiary',
      autopopulate: true,
    },
  ],
  totalMealDonated: {
    type: Number,
    default: 0,
  },
})
// class foodAngels who will registers as food doners have some basic properties

class FoodAngel {
  // kind of another method which allow foodangels to see the name of all of their foodRecievers
  async addBeneficiaries(beneficiary) {
    this.beneficiaries.push(beneficiary)
    this.totalMealDonated++
    this.availableMeal--
    await this.save()
  }

  async addAvailableMeal(number) {
    this.availableMeal += number
    await this.save()
  }

  get overView() {
    return `
     ${this.name} has ${this.availableMeal} meals and 
     it donates ${this.totalMealDonated} meal(s) till now and 
     has ${this.beneficiaries.length} beneficiarie(s)`
  }
}

FoodAngelSchema.loadClass(FoodAngel)
FoodAngelSchema.plugin(autopopulate)
FoodAngelSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
})
module.exports = mongoose.model('FoodAngel', FoodAngelSchema)
