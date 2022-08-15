exports.catchWrap = (func) => (req, res) => {
    Promise.resolve(func(req, res))
        .catch(error => {
            console.log(error)
            res.status(400).json({
                success: false,
                content: error
            });
        })
}   