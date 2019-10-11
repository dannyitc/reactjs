import findIndex from 'lodash/findIndex';

export const arrayToObject = (array, key) =>
    array.reduce((obj, item) => {
        obj[item[key]] = item
        return obj
    }, {});
export const findDefaultAddress = (user, type) => {
    let index = findIndex(user.addresses, function (address) { return address[type] === true });
    return index !== -1 ? user.addresses[index] : {};
}