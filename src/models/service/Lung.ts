import ILung from '../data/Lung';

export default class Lung {
    id?: string;
    uid: string;
    year: number;
    month: number;
    day: number;
    standardQuantity: number | null;
    packingQuantity: number | null;
    createTime: number;

    static toServiceModel(lung: ILung): Lung {
        return {
            id: lung.id,
            uid: lung.uid,
            year: lung.year,
            month: lung.month,
            day: lung.day,
            standardQuantity: lung.standardQuantity,
            packingQuantity: lung.packingQuantity,
            createTime: lung.createTime,
        };
    }
}
