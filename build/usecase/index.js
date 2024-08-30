"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usecase = void 0;
const promises_1 = __importDefault(require("fs/promises"));
class Usecase {
    constructor(tools, handleImageAnalyzerRepository, handleCustomerRepository) {
        this.tools = tools;
        this.handleImageAnalyzerRepository = handleImageAnalyzerRepository;
        this.handleCustomerRepository = handleCustomerRepository;
    }
    confirm(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.measure_uuid || !this.tools.uuidValidate(data.measure_uuid))
                return {
                    code: 400,
                    error_code: 'INVALID_DATA',
                    message: `The measure_uuid is invalid`,
                };
            if (data.confirmed_value === "" ||
                typeof data.confirmed_value !== "number" ||
                isNaN(data.confirmed_value) ||
                data.confirmed_value < 0 ||
                !Number.isInteger(data.confirmed_value))
                return {
                    code: 400,
                    error_code: 'INVALID_DATA',
                    message: `The confirmed_value is invalid`,
                };
            const measureExists = yield this.handleImageAnalyzerRepository.checkIfMeasureExists(data.measure_uuid);
            if (!measureExists[0][0])
                return {
                    code: 404,
                    error_code: 'MEASURE_NOT_FOUND',
                    message: `The measure does not exist`,
                };
            if (measureExists[0][0].has_confirmed === 1) {
                return {
                    code: 409,
                    error_code: 'CONFIRMATION_DUPLICATE',
                    message: `Leitura do mês já realizada`,
                };
            }
            try {
                yield this.handleImageAnalyzerRepository.confirm(data.measure_uuid, data.confirmed_value);
            }
            catch (err) {
                console.error('Error to confirm:', err);
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to confirm`,
                };
            }
            return undefined;
        });
    }
    handleList(customerCode, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (measureType) {
                measureType = measureType === null || measureType === void 0 ? void 0 : measureType.toLocaleUpperCase();
                if (measureType !== 'WATER' && measureType !== 'GAS')
                    return {
                        code: 400,
                        error_code: 'INVALID_TYPE',
                        message: `Tipo de medição não permitida`,
                    };
            }
            try {
                return yield this.handleCustomerRepository.listMeasure(customerCode, measureType);
            }
            catch (err) {
                console.error('Error to list measure:', err);
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to list measure`,
                };
            }
        });
    }
    handleUpload(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = this.validateToUpload(data);
            if (error) {
                return error;
            }
            const measureExists = yield this.handleImageAnalyzerRepository.checkIfMeasureExistsInThisPeriod(data.customer_code, data.measure_type, new Date(data.measure_datetime).getTime().toString());
            if (measureExists)
                return {
                    code: 409,
                    error_code: 'MEASURE_DUPLICATE',
                    message: `Leitura do mês já realizada`,
                };
            const mimeType = yield this.detectImageType(data.image);
            if (!(mimeType === null || mimeType === void 0 ? void 0 : mimeType.mime)) {
                return {
                    code: 400,
                    error_code: 'INVALID_DATA',
                    message: `The image is invalid`,
                };
            }
            const value = yield this.tools.generativeIA(data.image, mimeType.mime);
            if (typeof parseInt(value) !== 'number' && 'error_code' in value)
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to connect with IA`,
                };
            if (value === "++++++")
                return {
                    code: 400,
                    error_code: 'INVALID_DATA',
                    message: `The image is invalid`,
                };
            const measure_uuid = this.tools.generateUUID();
            const measure_value = parseInt(value);
            const image_url = `/uploads/${measure_uuid}.${mimeType.ext}`;
            const measure = {
                measure_uuid,
                measure_type: data.measure_type,
                measure_value,
                measure_datetime: new Date(data.measure_datetime).getTime(),
                image_url,
                customer_id: data.customer_code,
            };
            try {
                yield this.handleImageAnalyzerRepository.saveMeasure(measure);
            }
            catch (err) {
                console.error('Error to save measure:', err);
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to save measure`,
                };
            }
            const imageOrError = yield this.saveImage(data.image, measure_uuid, mimeType);
            if (typeof imageOrError !== 'string')
                return imageOrError;
            return {
                code: 200,
                image_url,
                measure_value,
                measure_uuid,
            };
        });
    }
    saveImage(image, nameFile, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = `./uploads/${nameFile}.${mimeType.ext}`;
            const dirPath = './uploads';
            try {
                if (!(yield this.checkIfDirExists(dirPath))) {
                    promises_1.default.mkdir(dirPath, { recursive: true });
                }
                promises_1.default.writeFile(filePath, image, 'base64');
            }
            catch (err) {
                console.error('Error to save image:', err);
                return {
                    code: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    message: `Error to save image`,
                };
            }
            return filePath;
        });
    }
    checkIfDirExists(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield promises_1.default.access(dir, promises_1.default.constants.F_OK)
                .then(() => true)
                .catch(() => false);
        });
    }
    detectImageType(image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tools.detectImageType(image);
        });
    }
    isDateValid(date) {
        return !isNaN(Date.parse(date));
    }
    validateToUpload(data) {
        if (data.measure_type !== 'WATER' && data.measure_type !== 'GAS')
            return {
                code: 400,
                error_code: 'INVALID_DATA',
                message: `The measure_type is invalid`,
            };
        if (!this.tools.uuidValidate(data.customer_code)) {
            return {
                code: 400,
                error_code: 'INVALID_DATA',
                message: `The customer_code is invalid`,
            };
        }
        if (!this.isDateValid(data.measure_datetime)) {
            return {
                code: 400,
                error_code: 'INVALID_DATA',
                message: `The measure_datetime is invalid`,
            };
        }
        if (!data.image && !this.tools.checkIfIsBase64(data.image, { paddingRequired: true })) {
            return {
                code: 400,
                error_code: 'INVALID_DATA',
                message: `The image is invalid`,
            };
        }
    }
}
exports.Usecase = Usecase;
