let errorHandler = {
  handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({'error':message});
  }
}

export default errorHandler;
