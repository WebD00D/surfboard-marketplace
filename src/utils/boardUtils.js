module.exports = {

  getStatusClass: function(status){
    switch (status) {
      case "PENDING":
        return "fc-yellow"
        break;
      case "FOR SALE":
        return "fc-green"
        break;
      case "SOLD":
        return "fc-red"
      default:

    }
  }

}
