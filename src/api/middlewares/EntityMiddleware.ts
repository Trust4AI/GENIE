const checkEntityExists =
    (entityService: any, idPathParamName: string) =>
    async (req: any, res: any, next: any) => {
        try {
            const entity = await entityService.exists(
                req.params[idPathParamName]
            )
            if (!entity) {
                return res.status(404).send({ error: 'Not found' })
            }
            return next()
        } catch (err) {
            return res.status(404).send(err)
        }
    }

export { checkEntityExists }
