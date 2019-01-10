import { createStore as reduxCreateStore } from 'redux';
import fire from '../fire';
import _ from 'lodash';

const reducer = (state, action) => {
	if (action.type === `INCREMENT`) {
		return Object.assign({}, state, {
			count: state.count + 1
		});
	}

	if (action.type === `CREATE_AND_SIGNIN_USER`) {
		fire
			.database()
			.ref('users/' + action.userId)
			.set({
				username: action.account_username,
				email: action.email,
				paypal_email: '',
				hasNotifications: false,
				seller: false,
				stripe: false
			});

		return {
			...state,
			userId: action.userId,
			account_username: action.account_username,
			firstTimeLogin: true,
			isSeller: false,
			userAuthenticated: true
		};
	}

	if (action.type === `CLEAR_NOTIFICATIONS`) {
		return { ...state, hasNotifications: false };
	}

	if (action.type === `SET_CURRENT_USER`) {
		console.log('setting curret user', action.userId, action.username, action.hasNotifications);

		console.log("BOARDGRAB USER COOKIE..");

		return {
			...state,
			userId: action.userId,
			account_username: action.username,
			userAuthenticated: true,
			currentUserEmail: action.email,
			hasNotifications: action.hasNotifications,
			paypal_email: action.paypal_email,
			isSeller: action.seller,
			stripe: action.stripe
		};
	}

	if (action.type === `SET_NEW_SELLER_INFO`) {
		return {
			...state,
			isSeller: action.seller,
			stripe: action.stripe
		};
	}

	if (action.type === `LOGOUT_USER`) {

		//document.cookie = "boardgrab_user" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

		fire.auth().signOut();
		return {
			...state,
			userId: '',
			account_username: '',
			userAuthenticated: false
		};
	}

	if (action.type === `GET_ALL_BOARDS`) {
		console.log('ALL BOARDS', action.boards);

		return {
			...state,
			allBoardsList: action.boards,
			boardsToDisplay: action.boards
		};
	}

	if (action.type === `GET_ALL_BOARDS_BY_REGION`) {
		console.log('BOARDS BY REGION', action.boards);

		return {
			...state,
			boardsByRegion: action.boards
		};
	}

	if (action.type === `GET_ALL_BOARDS_BY_CITY`) {
		console.log('BOARDS BY CITY', action.boards);

		return {
			...state,
			boardsByCity: action.boards
		};
	}

	if (action.type === `SET_REGION_AND_CITIES`) {
		const selectedRegion = action.region;

		const regionData = _.find(state.citesByRegion, function(o) {
			return o.region === selectedRegion;
		});

		let boardsByRegionData = _.find(state.boardsByRegion, function(o, i) {
			return i === selectedRegion;
		});

		if (!boardsByRegionData) {
			boardsByRegionData = [];
		}

		return {
			...state,
			selectedRegion: action.region,
			currentCityList: selectedRegion === 'All Locations' ? [] : regionData.cities,
			boardsToDisplay: selectedRegion === 'All Locations' ? state.allBoardsList : boardsByRegionData,
			selectedCity: 'All Cities',
			mapZoom: selectedRegion === 'All Locations' ? 2 : 6,
			latitude: selectedRegion === 'All Locations' ? 33.97980872872457 : regionData.cities[0].latitude,
			longitude: selectedRegion === 'All Locations' ? -118.0810546875 : regionData.cities[0].longitude,
			regionHasNoBoards: boardsByRegionData.length == 0 && selectedRegion != 'All Locations'
		};
	}

	if (action.type === `SET_CITY_DATA`) {
		const selectedCity = action.city;

		// TODO: If city selected is all cities, need to load all boards for that single city.

		if (selectedCity === 'All Cities') {
			// Let's get the region.
			const regionData = _.find(state.citesByRegion, function(o) {
				return o.region === state.selectedRegion;
			});

			let boardsByRegionData = _.find(state.boardsByRegion, function(o, i) {
				return i === state.selectedRegion;
			});

			if (!boardsByRegionData) {
				boardsByRegionData = [];
			}

			return {
				...state,
				selectedRegion: state.selectedRegion,
				currentCityList: state.selectedRegion === 'All Locations' ? [] : regionData.cities,
				boardsToDisplay: state.selectedRegion === 'All Locations' ? state.allBoardsList : boardsByRegionData,
				selectedCity: 'All Cities',
				mapZoom: state.selectedRegion === 'All Locations' ? 2 : 6,
				latitude: state.selectedRegion === 'All Locations' ? 33.97980872872457 : regionData.cities[0].latitude,
				longitude: state.selectedRegion === 'All Locations' ? -118.0810546875 : regionData.cities[0].longitude
			};
		}

		const cityData = _.find(state.currentCityList, function(o) {
			return o.name === selectedCity;
		});

		let boardsByCityData = _.find(state.boardsByCity, function(o, i) {
			return i === selectedCity;
		});

		const boardsByRegionData = _.find(state.boardsByRegion, function(o, i) {
			return i === state.selectedRegion;
		});

		console.log('BOARDS BY REGION DATA', boardsByRegionData);

		if (!boardsByCityData) {
			boardsByCityData = [];
		}

		let latitude = boardsByCityData.latitude;
		let longitude = boardsByCityData.longitude;

		// Sets region if not selected. This would happen if the user clicks on a map icon when the Region has been set
		// to "All Locations"

		let needToSetRegion = false;
		let regionToSet;
		let regionData;
		let citiesForDropdown;

		if (state.selectedRegion === 'All Locations') {
			needToSetRegion = true;
			regionToSet = _.find(state.cityMeta, function(o) {
				return o.name === selectedCity;
			});

			regionData = _.find(state.citesByRegion, function(o) {
				console.log(o.region, regionToSet.region);
				return o.region === regionToSet.region;
			});
		}

		return {
			...state,
			latitude: latitude,
			longitude: longitude,
			boardsToDisplay: selectedCity === 'All Cities' ? boardsByRegionData.boards : boardsByCityData.boards,
			selectedCity: selectedCity,
			mapZoom: selectedCity === 'All Cities' ? 4 : 12,
			selectedRegion: needToSetRegion ? regionToSet.region : state.selectedRegion,
			currentCityList: needToSetRegion ? regionData.cities : state.currentCityList,
			regionHasNoBoards: !boardsByRegionData
		};
	}

	if (action.type === `SET_LISTING_CITIES`) {
		const selectedRegion = action.region;
		console.log('SET IT,', action.region);
		const regionData = _.find(state.citesByRegion, function(o) {
			return o.region === selectedRegion;
		});

		let boardsByRegionData = _.find(state.boardsByRegion, function(o) {
			return o.region === selectedRegion;
		});

		console.log('BOARDS BY REGION', boardsByRegionData);

		if (!boardsByRegionData) {
			boardsByRegionData = [];
		}

		return {
			...state,
			dropDownCityList: selectedRegion === 'All Locations' ? [] : regionData.cities
		};
	}

	if (action.type === `SET_MAP_POSITION`) {
		return {
			...state,
			latitude: action.latitude,
			longitude: action.longitude
		};
	}

	if (action.type === `ALLOW_ACCESS`) {
		return {
			...state,
			accessGranted: true,
		};
	}



	return state;
};

const initialState = {
	count: 0,
	userId: '',
	userAuthenticated: false,
	firstTimeLogin: false,
	account_username: '',
	latitude: 33.985787115598434,
	longitude: -118.47003936767578,
	selectedRegion: 'All Locations',
	selectedCity: 'All Cities',
	mapZoom: 2,
	regionHasNoBoards: 'not set',
	userNotification: false,
	isSeller: false,
	currentUserEmail: '',
	hasNotifications: false,
	paypal_email: '',
	isSeller: false,
	stripe: '',
	accessGranted: false,

	// Southern California is the initial load on default. Will change this once we store users settings in a cookie.
	currentCityList: [
		// { name: 'All Cities', latitude: 33.985787115598434, longitude: -118.47003936767578 },
		// { name: 'San Diego', latitude: 32.71566625570317, longitude: -117.14996337890625 },
		// { name: 'La Jolla', latitude: 32.83459674730076, longitude: -117.26669311523438 },
		// { name: 'Del Mar', latitude: 32.960281958039836, longitude: -117.257080078125 },
		// { name: 'San Clemente', latitude: 33.42914915719729, longitude: -117.61138916015625 },
		// { name: 'Encinitas', latitude: 33.03399561940715, longitude: -117.279052734375 },
		// { name: 'Ocean Side', latitude: 33.19847683493303, longitude: -117.36968994140625 },
		// { name: 'Long Beach', latitude: 33.773439833797745, longitude: -118.19503784179688 },
		// { name: 'Venice', latitude: 33.985787115598434, longitude: -118.47003936767578 },
		// { name: 'Santa Monica', latitude: 34.021079493306914, longitude: -118.49647521972656 },
		// { name: 'Malibu', latitude: 34.02990029603907, longitude: -118.78486633300781 },
		// { name: 'Ventura', latitude: 34.27083595165, longitude: -119.23187255859375 },
		// { name: 'Santa Barbara', latitude: 34.42730166315869, longitude: -119.70977783203125 }
	],

	// This city list is specifically for the dropdowns on Board listing.
	// I didn't want to use currentCityList so change on dropdown doesn't effect nav bar.

	cityMeta: [
		// SOUTHERN CALIFORNIA
		{
			name: 'San Diego',
			latitude: 32.71566625570317,
			longitude: -117.14996337890625,
			region: 'Southern California'
		},
		{
			name: 'La Jolla',
			latitude: 32.83459674730076,
			longitude: -117.26669311523438,
			region: 'Southern California'
		},
		{ name: 'Del Mar', latitude: 32.960281958039836, longitude: -117.257080078125, region: 'Southern California' },
		{
			name: 'San Clemente',
			latitude: 33.42914915719729,
			longitude: -117.61138916015625,
			region: 'Southern California'
		},
		{ name: 'Encinitas', latitude: 33.03399561940715, longitude: -117.279052734375, region: 'Southern California' },
		{
			name: 'Ocean Side',
			latitude: 33.19847683493303,
			longitude: -117.36968994140625,
			region: 'Southern California'
		},
		{
			name: 'Long Beach',
			latitude: 33.773439833797745,
			longitude: -118.19503784179688,
			region: 'Southern California'
		},
		{ name: 'Venice', latitude: 33.985787115598434, longitude: -118.47003936767578, region: 'Southern California' },
		{
			name: 'Santa Monica',
			latitude: 34.021079493306914,
			longitude: -118.49647521972656,
			region: 'Southern California'
		},
		{ name: 'Malibu', latitude: 34.02990029603907, longitude: -118.78486633300781, region: 'Southern California' },
		{ name: 'Ventura', latitude: 34.27083595165, longitude: -119.23187255859375, region: 'Southern California' },
		{
			name: 'Santa Barbara',
			latitude: 34.42730166315869,
			longitude: -119.70977783203125,
			region: 'Southern California'
		},

		// NORTHERN CALIFORNIA
		{ name: 'All Cities', latitude: 37.50972584293751, longitude: -122.16796875, region: 'Northern California' },
		{
			name: 'Monterey',
			latitude: 36.59127365634205,
			longitude: -121.88507080078125,
			region: 'Northern California'
		},
		{
			name: 'Santa Cruz',
			latitude: 36.97622678464096,
			longitude: -122.0196533203125,
			region: 'Northern California'
		},
		{ name: 'San Jose', latitude: 37.341775502148586, longitude: -121.904296875, region: 'Northern California' },
		{
			name: 'Palo Alto',
			latitude: 37.45741810262938,
			longitude: -122.13775634765625,
			region: 'Northern California'
		},
		{
			name: 'San Francisco',
			latitude: 37.77071473849609,
			longitude: -122.4481201171875,
			region: 'Northern California'
		},
		{ name: 'Berkely',
		latitude: 37.87268533717655,
		longitude: -122.2833251953125, region: 'Northern California' },

		{ name: 'Vallejo',
		latitude: 38.10646650598286,
		longitude: -122.25860595703125, region: 'Northern California' },
		{
			name: 'Mendacino',
			latitude: 39.30242456041487,
			longitude: -123.7774658203125,
			region: 'Northern California'
		},

		// PACIFIC NORTH WEST
		{ name: 'All Cities', latitude: 46.042735653846506, longitude: -123.92578125, region: 'Pacific North West' },
		{ name: 'Portland', latitude: 45.51404592560424, longitude: -122.684326171875, region: 'Pacific North West' },
		{ name: 'Seattle', latitude: 47.60616304386874, longitude: -122.36572265625, region: 'Pacific North West' },
		{ name: 'Astoria', latitude: 47.60616304386874, longitude: -122.36572265625, region: 'Pacific North West' },

		// MID ATLANTIC
		{ name: 'All Cities', latitude: 37.54457732085582, longitude: -77.442626953125, region: 'Mid Atlantic' },
		{ name: 'Richmond', latitude: 37.54457732085582, longitude: -77.442626953125, region: 'Mid Atlantic' },
		{ name: 'Virginia Beach', latitude: 36.85325222344019, longitude: -75.9814453125, region: 'Mid Atlantic' },
		{ name: 'Outer Banks', latitude: 35.94688293218141, longitude: -75.6243896484375, region: 'Mid Atlantic' },
		{
			name: 'Southern Delaware',
			latitude: 38.53527591154414,
			longitude: -75.07232666015625,
			region: 'Mid Atlantic'
		},
		{ name: 'Ocean City', latitude: 39.281167913914636, longitude: -74.5806884765625, region: 'Mid Atlantic' },
		{ name: 'Eastern Shore', latitude: 37.56417412088097, longitude: -75.7122802734375, region: 'Mid Atlantic' },
		{ name: 'Atlantic City', latitude: 39.37040245787161, longitude: -74.44610595703125, region: 'Mid Atlantic' },
		{ name: 'Long Beach Island', latitude: 39.65434146406167, longitude: -74.190673828125, region: 'Mid Atlantic' },
		{ name: 'Seaside Heights', latitude: 39.9434364619742, longitude: -74.07257080078125, region: 'Mid Atlantic' },

		// SOUTH EAST
		{ name: 'All Cities', latitude: 34.66484057821928, longitude: -76.9427490234375, region: 'South East' },
		{ name: 'Emerald Isle', latitude: 34.66484057821928, longitude: -76.9427490234375, region: 'South East' },
		{ name: 'Wrightsville Beach', latitude: 34.17090836352573, longitude: -77.80517578125, region: 'South East' },
		{ name: 'Surf City', latitude: 34.42956713470528, longitude: -77.5469970703125, region: 'South East' },
		{ name: 'Myrtle Beach', latitude: 33.69235234723729, longitude: -78.8873291015625, region: 'South East' },
		{ name: 'Charleston', latitude: 32.78265637602964, longitude: -79.9310302734375, region: 'South East' },
		{ name: 'Folly Beach', latitude: 32.654407116645416, longitude: -79.9420166015625, region: 'South East' },
		{ name: 'Hilton Head', latitude: 32.20582936513577, longitude: -80.738525390625, region: 'South East' },
		{ name: 'Tybee Island', latitude: 31.99643007718664, longitude: -80.84976196289062, region: 'South East' },
		{ name: 'Brunswick', latitude: 31.15053220759678, longitude: -81.47872924804688, region: 'South East' },

		// EAST FLORIDA
		{ name: 'All Cities', latitude: 28.101057958669447, longitude: -80.5517578125, region: 'East Florida' },
		{ name: 'St. Augustine', latitude: 29.91685223307017, longitude: -81.32080078125, region: 'East Florida' },
		{ name: 'Cocoa Beach', latitude: 28.321306762152954, longitude: -80.60943603515625, region: 'East Florida' },
		{ name: 'Palm Beach', latitude: 26.698998877374333, longitude: -80.05050659179688, region: 'East Florida' },
		{ name: 'Delray', latitude: 26.45950861170239, longitude: -80.07522583007812, region: 'East Florida' },
		{ name: 'Miami', latitude: 25.764030136696327, longitude: -80.20294189453125, region: 'East Florida' },

		// HAWAII
		{ name: 'All Cities', latitude: 21.299610604945606, longitude: -157.862548828125, region: 'Hawaii' },
		{ name: "O'ahu", latitude: 21.442843107187656, longitude: -157.9998779296875, region: 'Hawaii' },
		{ name: 'Maui', latitude: 20.87677672772702, longitude: -156.6705322265625, region: 'Hawaii' },
		{ name: 'Hawaii', latitude: 20.035289711352377, longitude: -155.85617065429688, region: 'Hawaii' },

		// SOUTH AFRICA
		{ name: 'All Cities', latitude: -33.934245311173115, longitude: 18.4185791015625, region: 'South Africa' },
		{ name: 'Cape Town', latitude: -33.934245311173115, longitude: 18.4185791015625, region: 'South Africa' },

		// AUSTRALIA
		{ name: 'All Cities', latitude: -37.71859032558814, longitude: 144.931640625, region: 'Australia' },
		{ name: 'Melbourne', latitude: -37.85750715625203, longitude: 145.01953125, region: 'Australia' },
		{ name: 'Sydney', latitude: -33.87041555094182, longitude: 151.083984375, region: 'Australia' }
	],

	dropDownCityList: [
		{ name: 'All Cities', latitude: 33.985787115598434, longitude: -118.47003936767578 },
		{ name: 'San Diego', latitude: 32.71566625570317, longitude: -117.14996337890625 },
		{ name: 'La Jolla', latitude: 32.83459674730076, longitude: -117.26669311523438 },
		{ name: 'Del Mar', latitude: 32.960281958039836, longitude: -117.257080078125 },
		{ name: 'San Clemente', latitude: 33.42914915719729, longitude: -117.61138916015625 },
		{ name: 'Encinitas', latitude: 33.03399561940715, longitude: -117.279052734375 },
		{ name: 'Ocean Side', latitude: 33.19847683493303, longitude: -117.36968994140625 },
		{ name: 'Long Beach', latitude: 33.773439833797745, longitude: -118.19503784179688 },
		{ name: 'Venice', latitude: 33.985787115598434, longitude: -118.47003936767578 },
		{ name: 'Santa Monica', latitude: 34.021079493306914, longitude: -118.49647521972656 },
		{ name: 'Malibu', latitude: 34.02990029603907, longitude: -118.78486633300781 },
		{ name: 'Ventura', latitude: 34.27083595165, longitude: -119.23187255859375 },
		{ name: 'Santa Barbara', latitude: 34.42730166315869, longitude: -119.70977783203125 }
	],

	regions: [
		{ region: 'All Locations', latitude: 34.16181816123038, longitude: -116.806640625 },
		{ region: 'Southern California', latitude: 34.16181816123038, longitude: -116.806640625 },
		{ region: 'Northern California', latitude: 38.34165619279595, longitude: -122.783203125 },
		{ region: 'Pacific North West', latitude: 45.706179285330855, longitude: -123.837890625 },
		{ region: 'Mid Atlantic', latitude: 37.37015718405753, longitude: -76.376953125 },
		{ region: 'South East', latitude: 33.13755119234614, longitude: -80.244140625 },
		{ region: 'East Florida', latitude: 27.68352808378776, longitude: -80.33203125 },
		{ region: 'West Florida', latitude: 26.980828590472104, longitude: -82.705078125 },
		{ region: 'Hawaii', latitude: 20.715015145512083, longitude: -156.62109375 },
		{ region: 'Australia', latitude: -37.85750715625203, longitude: 145.01953125 },
		{ region: 'Cape Town', latitude: -33.87041555094182, longitude: 18.369140625 }
	],

	citesByRegion: [
		{
			region: 'Southern California',
			cities: [
				{ name: 'All Cities', latitude: 33.72433966174761, longitude: -117.158203125 },
				{ name: 'San Diego', latitude: 32.71566625570317, longitude: -117.14996337890625 },
				{ name: 'La Jolla', latitude: 32.83459674730076, longitude: -117.26669311523438 },
				{ name: 'Del Mar', latitude: 32.960281958039836, longitude: -117.257080078125 },
				{ name: 'San Clemente', latitude: 33.42914915719729, longitude: -117.61138916015625 },
				{ name: 'Encinitas', latitude: 33.03399561940715, longitude: -117.279052734375 },
				{ name: 'Ocean Side', latitude: 33.19847683493303, longitude: -117.36968994140625 },
				{ name: 'Long Beach', latitude: 33.773439833797745, longitude: -118.19503784179688 },
				{ name: 'Venice', latitude: 33.985787115598434, longitude: -118.47003936767578 },
				{ name: 'Santa Monica', latitude: 34.021079493306914, longitude: -118.49647521972656 },
				{ name: 'Malibu', latitude: 34.02990029603907, longitude: -118.78486633300781 },
				{ name: 'Ventura', latitude: 34.27083595165, longitude: -119.23187255859375 },
				{ name: 'Santa Barbara', latitude: 34.42730166315869, longitude: -119.70977783203125 }
			]
		},
		{
			region: 'Northern California',
			cities: [
				{ name: 'All Cities', latitude: 37.50972584293751, longitude: -122.16796875 },
				{ name: 'Monterey', latitude: 36.59127365634205, longitude: -121.88507080078125 },
				{ name: 'Santa Cruz', latitude: 36.97622678464096, longitude: -122.0196533203125 },
				{ name: 'San Jose', latitude: 37.341775502148586, longitude: -121.904296875 },
				{ name: 'Palo Alto', latitude: 37.45741810262938, longitude: -122.13775634765625 },
				{ name: 'San Francisco', latitude: 37.77071473849609, longitude: -122.4481201171875 },
				{ name: 'Berkely', latitude: 37.87268533717655, longitude: -122.2833251953125 },
				{ name: 'Vallejo', latitude: 38.10646650598286, longitude: -122.25860595703125 },
				{ name: 'Mendacino', latitude: 39.30242456041487, longitude: -123.7774658203125 }
			]
		},
		{
			region: 'Pacific North West',
			cities: [
				{ name: 'All Cities', latitude: 46.042735653846506, longitude: -123.92578125 },
				{ name: 'Portland', latitude: 45.51404592560424, longitude: -122.684326171875 },
				{ name: 'Seattle', latitude: 47.60616304386874, longitude: -122.36572265625 },
				{ name: 'Astoria', latitude: 47.60616304386874, longitude: -122.36572265625 }
			]
		},
		{
			region: 'Mid Atlantic',
			cities: [
				{ name: 'All Cities', latitude: 37.54457732085582, longitude: -77.442626953125 },
				{ name: 'Richmond', latitude: 37.54457732085582, longitude: -77.442626953125 },
				{ name: 'Virginia Beach', latitude: 36.85325222344019, longitude: -75.9814453125 },
				{ name: 'Outer Banks', latitude: 35.94688293218141, longitude: -75.6243896484375 },
				{ name: 'Southern Delaware', latitude: 38.53527591154414, longitude: -75.07232666015625 },
				{ name: 'Ocean City', latitude: 39.281167913914636, longitude: -74.5806884765625 },
				{ name: 'Eastern Shore', latitude: 37.56417412088097, longitude: -75.7122802734375 },
				{ name: 'Atlantic City', latitude: 39.37040245787161, longitude: -74.44610595703125 },
				{ name: 'Long Beach Island', latitude: 39.65434146406167, longitude: -74.190673828125 },
				{ name: 'Seaside Heights', latitude: 39.9434364619742, longitude: -74.07257080078125 }
			]
		},
		{
			region: 'South East',
			cities: [
				{ name: 'All Cities', latitude: 34.66484057821928, longitude: -76.9427490234375 },
				{ name: 'Emerald Isle', latitude: 34.66484057821928, longitude: -76.9427490234375 },
				{ name: 'Wrightsville Beach', latitude: 34.17090836352573, longitude: -77.80517578125 },
				{ name: 'Surf City', latitude: 34.42956713470528, longitude: -77.5469970703125 },
				{ name: 'Myrtle Beach', latitude: 33.69235234723729, longitude: -78.8873291015625 },
				{ name: 'Charleston', latitude: 32.78265637602964, longitude: -79.9310302734375 },
				{ name: 'Folly Beach', latitude: 32.654407116645416, longitude: -79.9420166015625 },
				{ name: 'Hilton Head', latitude: 32.20582936513577, longitude: -80.738525390625 },
				{ name: 'Tybee Island', latitude: 31.99643007718664, longitude: -80.84976196289062 },
				{ name: 'Brunswick', latitude: 31.15053220759678, longitude: -81.47872924804688 }
			]
		},
		{
			region: 'East Florida',
			cities: [
				{ name: 'All Cities', latitude: 28.101057958669447, longitude: -80.5517578125 },
				{ name: 'St. Augustine', latitude: 29.91685223307017, longitude: -81.32080078125 },
				{ name: 'Cocoa Beach', latitude: 28.321306762152954, longitude: -80.60943603515625 },
				{ name: 'Palm Beach', latitude: 26.698998877374333, longitude: -80.05050659179688 },
				{ name: 'Delray', latitude: 26.45950861170239, longitude: -80.07522583007812 },
				{ name: 'Miami', latitude: 25.764030136696327, longitude: -80.20294189453125 }
			]
		},

		{
			region: 'Hawaii',
			cities: [
				{ name: 'All Cities', latitude: 21.299610604945606, longitude: -157.862548828125 },
				{ name: "O'ahu", latitude: 21.442843107187656, longitude: -157.9998779296875 },
				{ name: 'Maui', latitude: 20.87677672772702, longitude: -156.6705322265625 },
				{ name: 'Hawaii', latitude: 20.035289711352377, longitude: -155.85617065429688 }
			]
		},

		{
			region: 'South Africa',
			cities: [
				{ name: 'All Cities', latitude: -33.934245311173115, longitude: 18.4185791015625 },
				{ name: 'Cape Town', latitude: -33.934245311173115, longitude: 18.4185791015625 }
			]
		},

		{
			region: 'Australia',
			cities: [
				{ name: 'All Cities', latitude: -37.71859032558814, longitude: 144.931640625 },
				{ name: 'Melbourne', latitude: -37.85750715625203, longitude: 145.01953125 },
				{ name: 'Sydney', latitude: -33.87041555094182, longitude: 151.083984375 }
			]
		}
	], // end cities by region

	boardsByRegion: [
		// {
		// 	region: 'Southern California',
		// 	latitude: 34.16181816123038,
		// 	longitude: -116.806640625,
		// 	boards: [
		// 		{
		// 			id: 1,
		// 			userId: 1,
		// 			region: 'Southern California',
		// 			tags: ['Beginners', 'Small Waves', 'A Tight Budget'],
		// 			city: 'San Diego',
		// 			name: `5'8" Rusty Dwart`,
		// 			brand: `Rusty`,
		// 			model: `Dwart`,
		// 			price: '300',
		// 			dimensions: ` 5'8" x 32" x 3" `,
		// 			fins: "3",
		// 			condition: "Good",
		// 			description: "Description lorem ipsum dolar set amit",
		// 			shaperInfo: "Shaper info lorem ipsum dolar set amit.",
		// 			featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 		}
		// 	]
		// }
	],

	boardsByCity: [
		// {
		// 	name: 'San Diego',
		// 	latitude: 32.71566625570317,
		// 	longitude: -117.14996337890625,
		// 	boards: [
		// 		{
		// 			id: 1,
		// 			userId: 1,
		// 			region: 'Southern California',
		// 			city: 'San Diego',
		// 			name: `5'8" Rusty Dwart`,
		// 			brand: `Rusty`,
		// 			model: `Dwart`,
		// 			price: '300',
		// 			dimensions: ` 5'8" x 32" x 3" `,
		// 			fins: "3",
		// 			condition: "Good",
		// 			description: "Description lorem ipsum dolar set amit",
		// 			shaperInfo: "Shaper info lorem ipsum dolar set amit.",
		// 			featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 			photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 		}
		// 	]
		// }
	], // END BOARDS BY CITY

	allBoardsList: [
		// {
		// 	id: 1,
		// 	userId: 1,
		// 	region: 'Southern California',
		// 	city: 'San Diego',
		// 	name: `5'8" Rusty Dwart`,
		// 	brand: `Rusty`,
		// 	model: `Dwart`,
		// 	price: '300',
		// 	dimensions: ` 5'8" x 32" x 3" `,
		// 	fins: "3",
		// 	condition: "Good",
		// 	description: "Description lorem ipsum dolar set amit",
		// 	shaperInfo: "Shaper info lorem ipsum dolar set amit.",
		// 	featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// }
	],

	// WILL DEFAULT TO SOUTHER CALIFORNIA BOARDS ON LOAD.
	boardsToDisplay: [
		// {
		// 	id: 1,
		// 	userId: 1,
		// 	region: 'Southern California',
		// 	city: 'San Diego',
		// 	name: `5'8" Rusty Dwart`,
		// 	brand: `Rusty`,
		// 	model: `Dwart`,
		// 	price: '300',
		// 	dimensions: ` 5'8" x 32" x 3" `,
		// 	fins: "3",
		// 	condition: "Good",
		// 	description: "Description lorem ipsum dolar set amit",
		// 	shaperInfo: "Shaper info lorem ipsum dolar set amit.",
		// 	featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// 	photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
		// }
	],

	boardsByUser: [
		{
			id: 1,
			userId: 1,
			region: 'Southern California',
			city: 'San Diego',
			name: `5'8" Rusty Dwart`,
			brand: `Rusty`,
			model: `Dwart`,
			price: '300',
			dimensions: ` 5'8" x 32" x 3" `,
			fins: '3',
			condition: 'Good',
			description: 'Description lorem ipsum dolar set amit',
			shaperInfo: 'Shaper info lorem ipsum dolar set amit.',
			featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg'
		}
	],

	// END BOARDS TO DISPLAY
	users: [
		{
			userId: 1,
			username: 'rva.christian',
			email: 'rva.christian91@gmail.com',
			profilePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
			boards: [1] // id's of boards
		}
	]
};

const createStore = () =>
	reduxCreateStore(
		reducer,
		initialState,
		//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);
export default createStore;
