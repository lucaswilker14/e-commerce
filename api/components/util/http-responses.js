import { StatusCodes } from 'http-status-codes'

const responses = (function() {
    const badRequest = function (message) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: message
        };
    };
    const unauthorized = function (message) {
        return {
            status: StatusCodes.UNAUTHORIZED,
            message: message
        };
    };
    const conflict = function (message) {
        return {
            status: StatusCodes.CONFLICT,
            message: message
        };
    };
    const created = function (message, data) {
        return {
            status: StatusCodes.CREATED,
            data: data,
            message: message
        };
    };
    const notFound = function (message) {
        return {
            status: StatusCodes.NOT_FOUND,
            message: message
        };
    };
    const internalError = function () {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'INTERNAL_ERROR'
        };
    };
    const ok = function (message, data) {
        return {
            status: StatusCodes.OK,
            message: message,
            data: data
        };
    };
    const notModified = function (message) {
        return {
            status: StatusCodes.NOT_MODIFIED,
            message: message
        };
    };
    const unprocessable_entity = function (message) {
        return {
            status: StatusCodes.UNPROCESSABLE_ENTITY,
            message: message
        };
    };

    return {
        notModified,
        ok,
        internalError,
        notFound,
        created,
        conflict,
        unauthorized,
        badRequest,
        unprocessable_entity
    }

})();


module.exports  = responses;