interface ITransaction {
    id: number;
    created_at: string;
    customer_id: number;
    phone_number: string;
    lens_kiri_speris:number;
    lens_kanan_speris:number;
    lens_kiri_addition:number;
    lens_kanan_addition:number;
    lens_kiri_cylinder:number;
    lens_kanan_cylinder:number;
    lens_kiri_axis:number;
    lens_kanan_axis:number;
    pupil_distance:number;
    lens_price: number;
    frame_price: number;
    notes_transaction: string;
    frame: string;
}

interface ITransactionListItem extends ITransaction {
    customer_name: string;
}

export type { ITransaction, ITransactionListItem }
