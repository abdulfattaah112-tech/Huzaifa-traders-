import * as ftp from "basic-ftp"

async function upload() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "46.202.199.92",
            user: "u144554334.huzaifatrader.site",
            password: "Ahmadqazi@1234",
            secure: false
        })
        console.log("Connected to Hostinger!")
        await client.clearWorkingDir() // Delete old files
        await client.uploadFromDir("dist")
        console.log("Upload successful!")
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

upload()
