import readline from 'readline';
import https from 'https';
import chalk from "chalk";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const url = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_HzIMj29eLlPvYowmmVBxOYYf1CM0tVIKRJNOSe6E";

https.get(url, (response) => {
    let data = "";

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        const parsed = JSON.parse(data);
        console.log(chalk.gray("DEBUG: Response from API =>"), parsed); // 👈 See the structure

        const rates = parsed.data; // adjust this if needed

        if (!rates) {
            console.log(chalk.red("❌ Could not read currency rates from API response"));
            rl.close();
            return;
        }

        rl.question("Enter the amount in USD: ", (amount) => {
            rl.question("Enter the target currency (e.g., INR, EUR, NPR): ", (currency) => {
                const rate = rates[currency.toUpperCase()];

                if (rate) {
                    const result = (amount * rate).toFixed(2);
                    console.log(chalk.greenBright(`${amount} USD ≈ ${result} ${currency.toUpperCase()}`));
                } else {
                    console.log(chalk.red(`❌ Invalid currency code: ${currency}`));
                }

                rl.close();
            });
        });
    });

}).on('error', (err) => {
    console.error(chalk.red(`Error fetching exchange rates: ${err.message}`));
});
