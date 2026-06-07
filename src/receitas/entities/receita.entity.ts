export class Receita {
  id_categorias: number | null;
  id_usuarios: number;

  nome: string | null;

  tempo_preparo_minutos: number | null;

  porcoes: number | null;

  modo_preparo: string;

  ingredientes: string | null;

  criado_em: Date;

  alterado_em: Date;
}
