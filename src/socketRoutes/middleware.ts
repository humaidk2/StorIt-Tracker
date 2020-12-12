export default function (client: any, admin: any) {
    client.use(async function (socket: any, next: any) {
        console.log('middleware', socket[1].token)
        if (
            socket[0] === 'addserver' ||
            socket[0] === 'upload' ||
            socket[0] === 'download' ||
            socket[0] === 'addclient'
        ) {
            try {
                const authToken = socket[1].token
                console.log('authenticated', authToken)
                const userInfo = await admin.auth().verifyIdToken(authToken)
                console.log('authenticated', userInfo.uid)
                socket[1].authId = userInfo.uid
                next()
            } catch (e) {
                console.log('not authenticated')
                console.log(e.message)
                // res.status(401).send({
                //     error: 'You are not authorized to make this request',
                // })
            }
        } else {
            next()
        }
    })
}
