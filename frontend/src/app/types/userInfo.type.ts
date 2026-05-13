import {PaymentType} from "./payment.type";
import {DeliveryType} from "./delivery.type";

export type UserInfoType = {
  deliveryType?: DeliveryType;
  firstName?: string,
  lastName?: string,
  phone?: string,
  fatherName?: string,
  paymentType?: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string
}
