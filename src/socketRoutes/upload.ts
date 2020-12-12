import placeFile from '../placeFile'
export default function (client: any, io: any, sequelize: any) {
    client.on('upload', function (details: any) {
        // // get user plan
        // var userQuery = firebase.database().ref('Users/' + details.authId);
        // userQuery.on('value', function(snapshot) {
        //   var userDetails = snapshot.val();
        //   console.log("userDetails = " + userDetails);
        // once u get the plan
        // for each region u need to find apt servers
        // get a list of all the servers
        // place the servers
        placeFile(
            sequelize,
            details.regions,
            details.authId,
            details.fileSize,
            client,
            io
        )
    })
}
