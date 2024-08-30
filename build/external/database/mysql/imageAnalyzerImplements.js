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
exports.ImageAnalyzer = void 0;
const implements_1 = __importDefault(require("./implements"));
class ImageAnalyzer extends implements_1.default {
    constructor(credentials) {
        super(credentials);
    }
    saveMeasure(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query(`
        INSERT INTO measures (measure_uuid, measure_type, measure_value, measure_datetime, image_url, customer_id)
        VALUES (?, ?, ?, DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m-%d %H:%i:%s'), ?, ?)`, [data.measure_uuid, data.measure_type, data.measure_value, data.measure_datetime, data.image_url, data.customer_id]);
        });
    }
    listMeasure(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    saveDataGenerateForIA(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`handleUpload is work`);
            return undefined;
        });
    }
    confirm(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query('UPDATE measures SET has_confirmed = 1, measure_value = ? WHERE measure_uuid = ?', [value, id]);
        });
    }
    checkIfMeasureExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection.query('SELECT has_confirmed FROM measures WHERE measure_uuid = ?', [id]);
        });
    }
    checkIfMeasureExistsInThisPeriod(customerId, mensureType, measureDatetime) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.connection.query(`
        SELECT * FROM measures 
        WHERE customer_id = ?
        AND measure_type = ?
        AND DATE_FORMAT(measure_datetime, '%Y-%m') = DATE_FORMAT(FROM_UNIXTIME(? / 1000), '%Y-%m')
        LIMIT 1`, [customerId, mensureType, measureDatetime]);
            console.log(result.length);
            return result.length > 0;
        });
    }
}
exports.ImageAnalyzer = ImageAnalyzer;
