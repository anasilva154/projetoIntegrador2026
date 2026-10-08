import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Tipo = "vaga" | "curso";

type Item = {
  id: number;
  tipo: Tipo;
  titulo: string;
  empresa: string;
  cidade: string;
  quantidade: number;
  presencial: boolean;
  sobre: string;
  setor: string;
  requisitos: string; // só vaga
  salario: string; // só vaga
  periodo: string; // só curso
  duracao: string; // só curso
  cargaHoraria: string;
};

type Form = Omit<Item, "id" | "tipo" | "quantidade"> & { quantidade: string };
type CampoTexto = Exclude<keyof Form, "presencial">;

const ROXO = "#7B2FF7";
const ROXO_CLARO = "#ECE8FB";
const AMARELO = "#F5B81C";
const AMARELO_ESCURO = "#B77900";
const CINZA_MODAL = "#F5F5F5";
const CINZA_CLARO = "#D9D9D9";
const CINZA_TEXTO = "#6E6A9A";
const MARINHO = "#1A1446";
const BORDA = "#E4E2F5";
const VERMELHO = "#D92D43";
const VERMELHO_CLARO = "#FDE8EB";
const BRANCO = "#FFFFFF";

const BASE = {
  tipo: "vaga" as Tipo,
  quantidade: 1,
  presencial: true,
  sobre: "",
  setor: "",
  requisitos: "",
  salario: "",
  periodo: "",
  duracao: "",
  cargaHoraria: "",
};

function criar(
  dados: Pick<Item, "id" | "titulo" | "empresa" | "cidade"> & Partial<Item>
): Item {
  return { ...BASE, ...dados };
}

const VAGAS_INICIAIS: Item[] = [
  criar({ id: 1, titulo: "Jovem Aprendiz / Auxiliar", empresa: "Nova Geração Soluções", cidade: "Criciúma - SC", quantidade: 1 }),
  criar({ id: 2, titulo: "Assistente Administrativo", empresa: "Nova Geração Soluções", cidade: "Criciúma - SC", quantidade: 2 }),
  criar({ id: 3, titulo: "Auxiliar de Produção", empresa: "Nova Geração Soluções", cidade: "Forquilhinha - SC", quantidade: 1 }),
  criar({ id: 4, titulo: "Estagiário de Marketing", empresa: "Nova Geração Soluções", cidade: "Criciúma - SC", quantidade: 1 }),
];

const FORM_VAZIO: Form = {
  titulo: "",
  empresa: "",
  cidade: "",
  quantidade: "1",
  presencial: true,
  sobre: "",
  setor: "",
  requisitos: "",
  salario: "",
  periodo: "",
  duracao: "",
  cargaHoraria: "",
};

function textoVagas(n: number) {
  return `${n} ${n === 1 ? "vaga" : "vagas"}`;
}

export default function Vagas() {
  const router = useRouter();

  const [vagas, setVagas] = useState<Item[]>(VAGAS_INICIAIS);
  const [busca, setBusca] = useState("");

  const [escolhaAberta, setEscolhaAberta] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tipoForm, setTipoForm] = useState<Tipo>("vaga");
  const [form, setForm] = useState<Form>(FORM_VAZIO);

  const ehCurso = tipoForm === "curso";

  const vagasFiltradas = vagas.filter((v) =>
    v.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  function atualizar<K extends keyof Form>(chave: K, valor: Form[K]) {
    setForm((f) => ({ ...f, [chave]: valor }));
  }

  function escolherTipo(tipo: Tipo) {
    setEscolhaAberta(false);
    setEditandoId(null);
    setTipoForm(tipo);
    setForm(FORM_VAZIO);
    setModalAberto(true);
  }

  function abrirEdicao(item: Item) {
    setEditandoId(item.id);
    setTipoForm(item.tipo);
    setForm({ ...item, quantidade: String(item.quantidade) });
    setModalAberto(true);
  }

  function salvar() {
    if (!form.titulo.trim()) return;

    const t = (s: string) => s.trim();

    const dados: Omit<Item, "id" | "tipo"> = {
      titulo: t(form.titulo),
      empresa: t(form.empresa),
      cidade: t(form.cidade),
      quantidade: Math.max(1, parseInt(form.quantidade, 10) || 1),
      presencial: form.presencial,
      sobre: t(form.sobre),
      setor: t(form.setor),
      requisitos: t(form.requisitos),
      salario: t(form.salario),
      periodo: t(form.periodo),
      duracao: t(form.duracao),
      cargaHoraria: t(form.cargaHoraria),
    };

    if (editandoId === null) {
      setVagas([...vagas, { id: Date.now(), tipo: tipoForm, ...dados }]);
    } else {
      setVagas(vagas.map((v) => (v.id === editandoId ? { ...v, ...dados } : v)));
    }

    setModalAberto(false);
  }

  function excluirVaga(id: number) {
    setVagas(vagas.filter((v) => v.id !== id));
  }

  function abrirDetalhes(item: Item) {
    router.push({
      pathname: "/rotas/produtos/detalhes",
      params: { dados: JSON.stringify(item) },
    });
  }

  function campo(chave: CampoTexto, placeholder: string, props: TextInputProps = {}) {
    return (
      <TextInput
        style={[styles.modalCampo, props.multiline && styles.modalCampoGrande]}
        placeholder={placeholder}
        value={form[chave]}
        onChangeText={(texto) => atualizar(chave, texto)}
        {...props}
      />
    );
  }

  const tituloModal =
    (editandoId === null ? "Novo" : "Editar") + (ehCurso ? " curso" : " vaga de emprego");

  const topoDaLista = (
    <View>
      <View style={styles.cabecalho}>
        <Image
          source={require("../../../../assets/images/vooa.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../../../../assets/images/do-utilizador.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      <View style={styles.conteudoTopo}>
        <View style={styles.linhaTitulo}>
          <Text style={styles.titulo}>Vagas disponíveis</Text>
          <Pressable
            style={styles.botaoAdicionar}
            onPress={() => setEscolhaAberta(true)}
            accessibilityLabel="Adicionar vaga ou curso"
          >
            <Ionicons name="add" size={22} color={BRANCO} />
          </Pressable>
        </View>

        <Text style={styles.subtitulo}>
          Gerencie as vagas da sua equipe e mantenha tudo organizado.
        </Text>

        <View style={styles.busca}>
          <Ionicons name="search-outline" size={22} color="#000000" />
          <TextInput
            style={styles.campoBusca}
            placeholder="Buscar por cargo ou curso..."
            placeholderTextColor="#6B6B6B"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.tela}>
      <FlatList
        data={vagasFiltradas}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={topoDaLista}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardCorpo}>
              <Pressable
                style={styles.cardInfo}
                onPress={() => abrirDetalhes(item)}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${item.titulo}`}
              >
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardEmpresa}>{item.empresa}</Text>

                <View style={styles.cardLinha}>
                  <Ionicons name="location-outline" size={16} color="#B77900" />
                  <Text style={styles.cardDetalhe}>{item.cidade}</Text>
                </View>

                <View style={styles.cardLinha}>
                  <Ionicons name="people-outline" size={16} color="#B77900" />
                  <Text style={styles.cardDetalhe}>{textoVagas(item.quantidade)}</Text>
                </View>
              </Pressable>

              <View style={styles.cardAcoes}>
                <Pressable style={styles.botaoRemover} onPress={() => excluirVaga(item.id)}>
                  <Ionicons name="trash-outline" size={14} color={VERMELHO} />
                  <Text style={styles.botaoRemoverTexto}>Remover</Text>
                </Pressable>

                <Pressable style={styles.botaoEditar} onPress={() => abrirEdicao(item)}>
                  <Ionicons name="pencil" size={14} color={ROXO} />
                  <Text style={styles.botaoEditarTexto}>Editar</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.cardSeta}
              hitSlop={12}
              onPress={() => abrirDetalhes(item)}
              accessibilityLabel="Ver detalhes"
            >
              <Ionicons name="chevron-forward" size={20} color={ROXO} />
            </Pressable>
          </View>
        )}
      />

      {/* ESCOLHA: VAGA OU CURSO */}
      <Modal
        visible={escolhaAberta}
        transparent
        animationType="fade"
        onRequestClose={() => setEscolhaAberta(false)}
      >
        <Pressable style={styles.modalFundo} onPress={() => setEscolhaAberta(false)}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>O que deseja adicionar?</Text>

            <Pressable style={styles.opcao} onPress={() => escolherTipo("vaga")}>
              <Ionicons name="briefcase-outline" size={24} color={AMARELO_ESCURO} />
              <Text style={styles.opcaoTexto}>Vaga de emprego</Text>
            </Pressable>

            <Pressable style={styles.opcao} onPress={() => escolherTipo("curso")}>
              <Ionicons name="school-outline" size={24} color={AMARELO_ESCURO} />
              <Text style={styles.opcaoTexto}>Curso</Text>
            </Pressable>

            <View style={styles.modalBotoes}>
              <Pressable onPress={() => setEscolhaAberta(false)}>
                <Text style={styles.modalCancelar}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* FORMULÁRIO */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>{tituloModal}</Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {campo("titulo", ehCurso ? "Nome do curso" : "Título da vaga")}
              {campo("empresa", ehCurso ? "Nome da instituição" : "Nome da empresa")}
              {campo("cidade", "Cidade - UF")}
              {campo("quantidade", "Quantidade de vagas", { keyboardType: "numeric" })}
              {campo("sobre", ehCurso ? "Sobre o curso" : "Sobre a vaga", {
                multiline: true,
              })}

              <Text style={styles.modalRotulo}>Modalidade</Text>
              <View style={styles.linhaModalidade}>
                <Pressable
                  style={[styles.chip, form.presencial && styles.chipAtivo]}
                  onPress={() => atualizar("presencial", true)}
                >
                  <Text style={[styles.chipTexto, form.presencial && styles.chipTextoAtivo]}>
                    Presencial
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.chip, !form.presencial && styles.chipAtivo]}
                  onPress={() => atualizar("presencial", false)}
                >
                  <Text style={[styles.chipTexto, !form.presencial && styles.chipTextoAtivo]}>
                    Não presencial
                  </Text>
                </Pressable>
              </View>

              {campo("setor", ehCurso ? "Setor (onde pode atuar)" : "Setor")}

              {ehCurso ? (
                <>
                  {campo("periodo", "Período (ex.: noturno)")}
                  {campo("duracao", "Duração do curso (ex.: 6 meses)")}
                  {campo("cargaHoraria", "Carga horária")}
                </>
              ) : (
                <>
                  {campo("requisitos", "Requisitos", { multiline: true })}
                  {campo("salario", "Salário")}
                  {campo("cargaHoraria", "Carga horária")}
                </>
              )}
            </ScrollView>

            <View style={styles.modalBotoes}>
              <Pressable onPress={() => setModalAberto(false)}>
                <Text style={styles.modalCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.modalSalvar} onPress={salvar}>
                <Text style={styles.modalSalvarTexto}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: ROXO,
  },
  lista: {
    paddingBottom: 24,
  },

  /* Topo branco */
  cabecalho: {
    height: 105,
    backgroundColor: BRANCO,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 200,
    height: 100,
    marginLeft: -34,
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 16,
  },

  /* Conteúdo roxo */
  conteudoTopo: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F5B81C",
  },
  botaoAdicionar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: 6 }],
  },
  subtitulo: {
    fontSize: 15,
    lineHeight: 21,
    color: "rgba(255,255,255,0.90)",
    marginTop: 6,
    maxWidth: 320,
  },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CINZA_CLARO,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 22,
  },
  campoBusca: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },

  /* Cards */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRANCO,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDA,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCorpo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingRight: 22,
  },
  cardInfo: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 140,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: MARINHO,
  },
  cardEmpresa: {
    fontSize: 14,
    color: CINZA_TEXTO,
    marginTop: 2,
    marginBottom: 6,
  },
  cardLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  cardDetalhe: {
    fontSize: 13,
    color: CINZA_TEXTO,
  },
  cardAcoes: {
    flexDirection: "column",
    gap: 8,
    alignSelf: "flex-start",
    transform: [{ translateY: 6 }],
  },
  botaoEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ROXO_CLARO,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 28,
  },
  botaoEditarTexto: {
    color: ROXO,
    fontWeight: "700",
    fontSize: 12,
  },
  botaoRemover: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: VERMELHO_CLARO,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 28,
  },
  botaoRemoverTexto: {
    color: VERMELHO,
    fontWeight: "700",
    fontSize: 12,
  },
  cardSeta: {
    position: "absolute",
    right: 12,
    bottom: 14,
  },

  /* Modais */
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCaixa: {
    backgroundColor: BRANCO,
    borderRadius: 20,
    padding: 18,
    maxHeight: "85%",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: AMARELO_ESCURO,
    marginBottom: 12,
  },
  modalCampo: {
    backgroundColor: CINZA_MODAL,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: MARINHO,
  },
  modalCampoGrande: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalRotulo: {
    fontSize: 13,
    fontWeight: "700",
    color: MARINHO,
    marginBottom: 6,
    marginTop: 2,
  },
  linhaModalidade: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CINZA_MODAL,
  },
  chipAtivo: {
    backgroundColor: AMARELO,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: CINZA_TEXTO,
  },
  chipTextoAtivo: {
    color: MARINHO,
  },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CINZA_MODAL,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  opcaoTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: MARINHO,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  modalCancelar: {
    color: CINZA_TEXTO,
    fontWeight: "700",
  },
  modalSalvar: {
    backgroundColor: AMARELO,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  modalSalvarTexto: {
    color: MARINHO,
    fontWeight: "700",
  },
});