import axios from "axios";
import chalk from "chalk";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/** 
 * @param {string} countryCode
 * @param {number} count
 * @param {string} username
 * @description Permet de récupérer les noms de lieux d'un pays
 * @description (Vous pouvez aussi l'utiliser pour les codes postaux, les noms de rue, etc...)
 */
async function getPlaceNames(countryCode, count, username) {
    const url = `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=${count}&username=${username}`;

    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data.geonames.map((place) => place.name);
        } else {
            console.log(chalk.red(response.status));
            return [];
        }
    } catch (error) {
        console.log(chalk.red(error.message));
        return [];
    }
}

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(chalk.cyan(question), (answer) => resolve(answer.trim()));
    });
}

/**
 * @description Fonction principale pour interagir avec le script et générer les noms
 */
async function main() {
    const countryCode = await promptUser(
        "Entrez le code du pays par exemple JP pour Japon, FR pour France, etc.. : "
    );
    const count = parseInt(
        await promptUser("Combien de noms voulez-vous générer ? : "),
        10
    );
    const username = await promptUser(
        "Entrez votre nom d'utilisateur GeoNames (Tu dois créer ton compte) : "
    );

    console.log(chalk.yellow("\nChargement..."));

    if (isNaN(count) || count <= 0) {
        console.log(chalk.red("Pas de nom négatif ou nul"));
        rl.close();
        return;
    }

    const placeNames = await getPlaceNames(
        countryCode.toUpperCase(),
        count,
        username
    );

    if (placeNames.length > 0) {
        console.log(
            chalk.green(
                `\nGénérés (${placeNames.length
                }) pour ${countryCode.toUpperCase()} :`
            )
        );
        placeNames.forEach((name, index) => {
            console.log(chalk.blue(`${index + 1}. ${name}`));
        });
    } else {
        console.log(chalk.red("\nRien à afficher..."));
    }

    rl.close();
}

main();