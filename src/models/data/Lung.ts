export default interface ILung {
    id: string;
    uid: string;
    year: number;
    month: number;
    day: number;
    standardQuantity: number | null;
    packingQuantity: number | null;
    createTime: number;
}
