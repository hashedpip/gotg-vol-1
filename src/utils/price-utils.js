const axios = require('axios')

async function getPrice () {
  try {
    const response = await axios.get(
      'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
    )

    const json = response.data
    return json.USD
  } catch (ex) {
    // error
    console.log(ex)
  };
}

module.exports = { getPrice }
