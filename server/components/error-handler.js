let errorHandler = {
  handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({'error':message});
  },
  checkValidationErrors(req, res){
    let errors = req.validationErrors();
    if(errors){
      let response = {errors: [] };
      errors.forEach((err)=>{
         response.errors.push(err.msg);
      });
      res.statusCode = 400;
      return res.json(response);
    }
  }
}
export default errorHandler;
