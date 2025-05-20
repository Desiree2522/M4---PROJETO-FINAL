import express from "express";
import cors from "cors";
import { swaggerUi, swaggerDocs } from './swagger.js';

import logDoacaoRoutes from "./routes/logDoacao.routes.js"
import feedbackRoutes from "./routes/feedbacks.routes.js";
import doacoesRouters from "./routes/doacoes.routes.js";
import locaisRouters from "./routes/locais.routes.js";
import campanhasRouters from "./routes/campanhas.routes.js";
import routerCategoria from "./routes/categoria.routes.js";
import routerUser from "./routes/users.routes.js";

//const { swaggerUi, swaggerDocs } = require('./swagger');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API funcionando corretamente!" });
});

// Rotas
app.use("/user",routerUser);
app.use("/logs-alteracao",logDoacaoRoutes );
app.use("/feedbacks", feedbackRoutes);
app.use("/doacoes", doacoesRouters);
app.use("/locais", locaisRouters);
app.use("/campanhas", campanhasRouters);
app.use("/categorias", routerCategoria);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use("/user",routerUser);
app.use('/campanha', campanhasRouters);
app.use('/doacoes', doacoesRouters);
app.use('/feedback', feedbackRoutes);
app.use('/locais', locaisRouters);
app.use("/categorias", routerCategoria);
app.use("/logs-alteracao",logDoacaoRoutes );


//app.use('/users', usersRoutes);


// Inicialização do servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em ${PORT}`);

});

export default app;
