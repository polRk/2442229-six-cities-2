import { type IUser } from "./user";

export enum City {
	PARIS = "Paris",
	COLOGNE = "Cologne",
	BRUSSELS = "Brussels",
	AMSTERDAM = "Amsterdam",
	HAMBURG = "Hamburg",
	DUSSELDORF = "Dusseldorf",
}

export type Coordinates = {
  latitude: number,
  longitude: number
}

export enum HousingType {
	APARTMENT = "apartment",
	HOUSE = "house",
	ROOM = "room",
	HOTEL = "hotel"
}

export enum Facilities {
	BREAKFAST = "Breakfast",
	AIR_CONDITIONING = "Air conditioning",
	LAPTOP_FRIENDLY_WORKSPACE = "Laptop friendly workspace",
	BABY_SEAT = "Baby seat",
	WASHER = "Washer",
	TOWELS = "Towels",
	FRIDGE = "Fridge"
}

/**
 * Предложение по аренде
 */
export interface IOffer {
	/**
	 * Наименование.
	 * Обязательное.
	 * Мин. длин 10 символов, макс. длина 100;
	 */
	title: string

	/**
	 * Описание предложения.
	 * Обязательное.
	 * Мин. длина 20 символов, макс. длина 1024 символа;
	 */
	description: string

	/**
	 * Дата публикации предложения.
	 * Обязательное.
	 */
	publicationDate: Date

	/**
	 * Город.
	 * Обязательное.
	 * Один из шести городов.
	 */
	city: City

	/**
	 * Превью изображения.
	 * Обязательное.
	 * Ссылка на изображение, которое используется в качестве превью;
	 */
	preview: `https://${string}`;

	/**
	 * Фотографии жилья.
	 * Обязательное.
	 * Список ссылок на фотографии жилья.
	 * Всегда 6 фотографий;
	 */
	images: [
		`https://${string}`,
		`https://${string}`,
		`https://${string}`,
		`https://${string}`,
		`https://${string}`,
		`https://${string}`
	];

	/**
	 * Флаг «Премиум».
	 * Обязательное.
	 * Признак премиальности предложения;
	 */
	premium: boolean;

	/**
	 * Флаг «Избранное».
	 * Обязательное.
	 * Признак того, что предложение принадлежит списку избранных предложений пользователя;
	 */
	favourite: boolean;

	/**
	 * Рейтинг.
	 * Обязательное.
	 * Число от 1 до 5.
	 * Допускаются числа с запятой (1 знак после запятой);
	 */
	rating: number;

	/**
	 * Тип жилья. Обязательное. Один из вариантов: apartment, house, room, hotel;
	 */
	housingType: HousingType;

	/**
	 * Количество комнат.
	 * Обязательное.
	 * Мин. 1, Макс. 8;
	 */
	roomCount: number;

	/**
	 * Количество гостей.
	 * Обязательное.
	 * Мин. 1, Макс. 10;
	 */
	guestCount: number;

	/**
	 * Стоимость аренды.
	 * Обязательное.
	 * Мин. 100, Макс. 100 000;
	 */
	cost: number;

	/**
	 * Удобства.
	 * Обязательное.
	 * Список удобств.
	 * Один или несколько вариантов из списка: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge;
	 */
	facilities: Facilities[];

	/**
	 * Автор предложения.
	 * Обязательное.
	 * Ссылка на сущность «Пользователь»;
	 */
	author: IUser;

	/**
	 * Количество комментариев.
	 * Рассчитывается автоматически;
	 */
	commentsCount: number;

	/**
	 * Координаты предложения для аренды.
	 * Обязательное.
	 * Координаты представлены широтой и долготой.
	 */
	coordinates: Coordinates;
}
