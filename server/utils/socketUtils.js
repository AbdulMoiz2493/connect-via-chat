
export const getSockets = async (members = [], socketsMapCollection) => {
    const sockets = members.map((user) => {
        return socketsMapCollection.get(user.toString());
    }).filter(socketId => socketId);

    return sockets;
}