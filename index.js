
const express = require('express')
const crypto = require('crypto');
const qrcode = require('qrcode')
const fs = require('fs');



// recuperer le contenu du .env
require('dotenv').config()
const { CONTRACT_ADRESS, ACCOUNT_OWNER } = process.env

// Implementation du smart contract
const Web3 = require('web3')
const MedocContract = require('./build/contracts/MedocContract.json')
const contractABI = MedocContract.abi
const contractAddress = CONTRACT_ADRESS
const rcpEndpoint = 'http://127.0.0.1:9545'
// *********    End 

const app = express()
app.use(express.json())



app.post('/add-medicament', async (req, res) => {
    const calcul1 = new Date().getTime()
    const libelle = "ParacCCCCCCCCC cOMPRIEEEEEEEEEME 1000mg"
    const lotId = 1
    const datePeremption = "2024-12-11"
    const _ipfsHash = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"       // 1 medoc



    // creation du répertoire
    const folderName = 'qrcode-images/Lot03'
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        for (let i = 0; i < 1; i++) {
            const jsonData = {
                libelle: libelle,
                lotId: lotId,
                datePeremption: datePeremption,
                timestamp: Date.now()
            }

            // Convertir les données JSON en chaîne
            const jsonString = JSON.stringify(jsonData);

            // Utiliser crypto pour SHA-256
            const sha256Hash = crypto.createHash('sha256').update(jsonString).digest('hex');
            console.log("SHA-256 (crypto):", sha256Hash);
            console.log(sha256Hash)

            // *********** Generation QRcode
            const qrcodeImagePATH = './' + folderName + '/' + sha256Hash + '.png'
            console.log(qrcodeImagePATH)

            qrcode.toFile(qrcodeImagePATH, sha256Hash, {
                errorCorrectionLevel: 'H'
            }, err => {
                if (err) throw err
                console.log('QR code généré avec succes !')
            })

            // Save on blockchain
            const result = await contract.methods.addMedicament(libelle, lotId, datePeremption, sha256Hash, "14-09-2023").send({ from: accounts[0], gas: 1000000 })
            console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
            console.log(result)
            console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù ------------------>>   ' + i)

        }
        const calcul2 = new Date().getTime()
        console.log("############           La durée est __________   " + (calcul2 - calcul1))
        console.log(calcul1)
        console.log(calcul2)
        return res.json({ message: "Medicament ajouté avec success dans la BC"})

    } catch (error) {
        console.log('Error lors de l ajout du médicament dans la BC')
        console.log(error)
        return res.json({ error: error })
    }
})

app.post('/get-medicament', async (req, res) => {
    const calcul1 = new Date().getTime()

    const _ipfsHash = "ef11acf6948abdd11d5bdb98f07dc9167a9c967b30a0bc38b249221d4d609e62"
    // const _ipfsHash = "04eb0af5ff2950f5331f7b79c495e8472278ee59b1ce87b1885c2f8ee6caad27"       // 2 medoc

    const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const accounts = await web3.eth.getAccounts()
    console.log('******************************************************')
    console.log(accounts)
    console.log('******************************************************')

    // recuperer le hash sur dans la blockchain
    const result = await contract.methods.getHistoryMedicament(_ipfsHash).call({ from: accounts[0], to: contractAddress, gas: 3000000 })
    // console.log('******************************************************')
    console.log(result)
    if (result == "") {
        return res.json({ message: "Ce Médicament n'existe pas sur la blockchain" })
    }
    console.log('******************************************************')
    console.log(result[0])
    console.log(result[1])
    console.log(result[2])
    console.log(result[3])
    console.log(result[4])
    const tabHistory = result[4]
    var data = []
    for (let i = 0; i < tabHistory.length; i++) {
        const h = tabHistory[i];
        const d = {
            structure: h[0][0],
            typeStructure: h[0][1],
            date: h[1]
        }
        data.push(d)
    }
    console.log('******************************************************')
    const calcul2 = new Date().getTime()
        console.log("############           La durée est __________   " + (calcul2 - calcul1))
        console.log(calcul1)
        console.log(calcul2)
    return res.json({ data: data, result: result })


})

app.post('/add-medicament-on-pra', async (req, res) => {
    const calcul1 = new Date().getTime()
    const _ipfsHash = "825e9a8b4ce0218f5877c6b71fa6a1b6b8c7b46f0178b0ae745f78c606981b19"
    // const _ipfsHash = "04eb0af5ff2950f5331f7b79c495e8472278ee59b1ce87b1885c2f8ee6caad27"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        // console.log('******************************************')
        // console.log(accounts)
        // console.log('******************************************')

        const result = await contract.methods.addMedicamentOnPraStock(_ipfsHash, "15-08-2023").send({ from: accounts[1], gas: 1000000 })
        // console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        // console.log(result)
        // console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        const calcul2 = new Date().getTime()
        console.log("############           La durée est __________   " + (calcul2 - calcul1))
        console.log(calcul1)
        console.log(calcul2)

        return res.json({ message: "Medicament ajouté avec success dans le stock PRA de la BC", result: result })
    } catch (error) {
        console.log('Error lors de l ajout du médicament dans le stock PRA')
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})

app.post('/add-medicament-on-hopital', async (req, res) => {
    const _ipfsHash = "cpppppppppppppppppppppppppppp"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addMedicamentOnHopitalStock(_ipfsHash, "15-08-2023").send({ from: accounts[1], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Medicament ajouté avec success dans le stock de l'opital de la BC", result: result })
    } catch (error) {
        console.log("Error lors de l ajout du médicament dans le stock de l'opital")
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})

app.post('/add-medicament-on-district', async (req, res) => {
    const _ipfsHash = "cpppppppppppppppppppppppppppp"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addMedicamentOnDistrictStock(_ipfsHash, "15-08-2023").send({ from: accounts[2], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Medicament ajouté avec success dans le stock du district de la BC", result: result })
    } catch (error) {
        console.log("Error lors de l ajout du médicament dans le stock du district")
        console.log(error.data)
        return res.json({ error: error })
    }
})

app.post('/add-medicament-on-poste-de-sante', async (req, res) => {
    const _ipfsHash = "cpppppppppppppppppppppppppppp"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addMedicamentOnPosteSanteStock(_ipfsHash, "15-08-2023").send({ from: accounts[3], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Medicament ajouté avec success dans le stock du poste de santé de la BC", result: result })
    } catch (error) {
        console.log("Error lors de l ajout du médicament dans le stock du poste de santé")
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})

app.post('/add-medicament-on-centre-de-sante', async (req, res) => {
    const _ipfsHash = "cpppppppppppppppppppppppppppp"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addMedicamentOnCentreSanteStock(_ipfsHash, "15-08-2023").send({ from: accounts[4], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Medicament ajouté avec success dans le stock du centre de santé de la BC", result: result })
    } catch (error) {
        console.log("Error lors de l ajout du médicament dans le stock du centre de santé")
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})

app.post('/add-medicament-on-case-de-sante', async (req, res) => {
    const _ipfsHash = "cpppppppppppppppppppppppppppp"       // 2 medoc

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addMedicamentOnCaseSanteStock(_ipfsHash, "15-08-2023").send({ from: accounts[4], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Medicament ajouté avec success dans le stock du case de santé de la BC", result: result })
    } catch (error) {
        console.log("Error lors de l ajout du médicament dans le stock du case de santé")
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})



app.post('/add-structure', async (req, res) => {

    // const ipfsHash = ipfsHashAdded

    try {
        // configurer le fornisseur de module
        const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))
        // se connecter au smart contract pour interagir avec la blockchain
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        // recuperer les comptes du reseau
        const accounts = await web3.eth.getAccounts()
        console.log('******************************************')
        console.log(accounts)
        console.log('******************************************')

        const result = await contract.methods.addPra(accounts[1], "PrA Dkr").send({ from: accounts[0], gas: 1000000 })
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        console.log(result)
        console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùùù')
        return res.json({ message: "Structure PRA ajouté avec success dans la BC", result: result })
    } catch (error) {
        console.log('Error lors de l ajout de PNA nationale')
        console.log(error.data.reason)
        return res.json({ error: error })
    }
})

app.post('/get-block', async (req, res) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint))

    await web3.eth.getBlock(5)
        .then(block => {
            console.log("Block Number:", block.number);
            console.log("Timestamp:", new Date(block.timestamp * 1000));
            console.log("Transactions:", block.transactions);
            // ... Autres données du bloc
            return res.json({ block: block })
        })
        .catch(error => {
            console.error("Error:", error);
        });

})

app.listen(3000, () => {
    console.log('Serveur demarré sur le port 3000')
})