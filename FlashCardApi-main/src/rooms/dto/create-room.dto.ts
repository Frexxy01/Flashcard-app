export class CreateRoomDto {
    roomNumber: string;
    roomType: string;
    amenities: string;
    price: number;
    photos: string;
    checkinTime: Date;
    checkoutTime: Date;
    rating: number;
}


export class CreateStudyCardDto {
    id: string;
    magyar:string;
    nemet: string;
    category: string;
}