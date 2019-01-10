// let listingDate = new Date()
// console.log(listingDate.getMonth());
//
// formatMonth("hello");
// function formatMonth(n) {
//
// 	switch(n) {
//   	case "hello":
//     console.log("logging hello");
//     break;
//    default:
//    	/// default;
//   }
//

module.exports = {


  getMonth: function(d) {

    switch(d) {

      case 0:
        return "01";
        break;
      case 1:
        return "02";
        break;
      case 2:
        return "03";
        break;
      case 3:
        return "04";
        break;
      case 4:
        return "05";
        break;
      case 5:
        return "06";
        break;
      case 6:
        return "07";
        break;
      case 7:
        return "08";
        break;
      case 8:
        return "09";
        break;
      case 9:
        return "10";
        break;
      case 10:
        return "11";
        break;
      case 11:
        return "12";
        break;
      default:


    }


    return "";
  }


}
