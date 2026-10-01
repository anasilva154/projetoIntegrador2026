import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Vaga = {
  id: number;
  titulo: string;
  empresa: string;
  cidade: string;
  quantidade: number;
};

const VAGAS_INICIAIS: Vaga[] = [
  {
    id: 1,
    titulo: "Jovem Aprendiz / Auxiliar",
    empresa: "Nova Geração Soluções",
    cidade: "Criciúma - SC",
    quantidade: 1,
  },
  {
    id: 2,
    titulo: "Assistente Administrativo",
    empresa: "Nova Geração Soluções",
    cidade: "Criciúma - SC",
    quantidade: 2,
  },
  {
    id: 3,
    titulo: "Auxiliar de Produção",
    empresa: "Nova Geração Soluções",
    cidade: "Forquilhinha - SC",
    quantidade: 1,
  },
  {
    id: 4,
    titulo: "Estagiário de Marketing",
    empresa: "Nova Geração Soluções",
    cidade: "Criciúma - SC",
    quantidade: 1,
  },
];

function textoVagas(n: number) {
  return `${n} ${n === 1 ? "vaga" : "vagas"}`;
}

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>(VAGAS_INICIAIS);
  const [busca, setBusca] = useState("");

  // Formulário
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cidade, setCidade] = useState("");
  const [quantidade, setQuantidade] = useState("1");

  const vagasFiltradas = vagas.filter((v) =>
    v.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirNovaVaga() {
    setEditandoId(null);
    setTitulo("");
    setEmpresa("");
    setCidade("");
    setQuantidade("1");
    setModalAberto(true);
  }

  function abrirEdicao(vaga: Vaga) {
    setEditandoId(vaga.id);
    setTitulo(vaga.titulo);
    setEmpresa(vaga.empresa);
    setCidade(vaga.cidade);
    setQuantidade(String(vaga.quantidade));
    setModalAberto(true);
  }

  function salvarVaga() {
    if (!titulo.trim()) return;

    const qtd = Math.max(1, parseInt(quantidade, 10) || 1);

    if (editandoId === null) {
      setVagas([
        ...vagas,
        {
          id: Date.now(),
          titulo: titulo.trim(),
          empresa: empresa.trim(),
          cidade: cidade.trim(),
          quantidade: qtd,
        },
      ]);
    } else {
      setVagas(
        vagas.map((v) =>
          v.id === editandoId
            ? {
                ...v,
                titulo: titulo.trim(),
                empresa: empresa.trim(),
                cidade: cidade.trim(),
                quantidade: qtd,
              }
            : v
        )
      );
    }

    setModalAberto(false);
  }

  function excluirVaga(id: number) {
    setVagas(vagas.filter((v) => v.id !== id));
  }

  const topoDaLista = (
    <View>
      {/* TOPO BRANCO */}
      <View style={styles.cabecalho}>
        <Image
          source={require("../../../../assets/images/vooa.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color={BRANCO} />
        </View>
      </View>

      {/* CONTEÚDO ROXO */}
      <View style={styles.conteudoTopo}>
        <Text style={styles.titulo}>Vagas disponíveis</Text>

        <Text style={styles.subtitulo}>
          Gerencie as vagas da sua equipe e mantenha tudo organizado.
        </Text>

        {/* BUSCA */}
        <View style={styles.busca}>
          <Ionicons
            name="search-outline"
            size={22}
            color="#000000"
          />

          <TextInput
            style={styles.campoBusca}
            placeholder="Buscar por cargo..."
            placeholderTextColor="rgba(255,255,255,0.75)"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* CONTADOR E ADICIONAR */}
        <View style={styles.linhaAcoes}>
          <View style={styles.contador}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={BRANCO}
            />

            <Text style={styles.contadorTexto}>
              {textoVagas(vagas.length)}
            </Text>
          </View>

          <Pressable
            style={styles.botaoAdicionar}
            onPress={abrirNovaVaga}
          >
            <Ionicons
              name="add"
              size={22}
              color={ROXO}
            />

            <Text style={styles.botaoAdicionarTexto}>
              Adicionar vaga
            </Text>
          </Pressable>
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

            {/* INFORMAÇÕES */}
            <View style={styles.cardCorpo}>

              <View style={styles.cardInfo}>

                <Text style={styles.cardTitulo}>
                  {item.titulo}
                </Text>

                <Text style={styles.cardEmpresa}>
                  {item.empresa}
                </Text>

                <View style={styles.cardLinha}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={ROXO}
                  />

                  <Text style={styles.cardDetalhe}>
                    {item.cidade}
                  </Text>
                </View>

                <View style={styles.cardLinha}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={ROXO}
                  />

                  <Text style={styles.cardDetalhe}>
                    {textoVagas(item.quantidade)}
                  </Text>
                </View>

              </View>

              {/* BOTÕES */}
              <View style={styles.cardAcoes}>

                <Pressable
                  style={styles.botaoEditar}
                  onPress={() => abrirEdicao(item)}
                >
                  <Ionicons
                    name="pencil"
                    size={14}
                    color={ROXO}
                  />

                  <Text style={styles.botaoEditarTexto}>
                    Editar
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.botaoRemover}
                  onPress={() => excluirVaga(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={14}
                    color={VERMELHO}
                  />

                  <Text style={styles.botaoRemoverTexto}>
                    Remover
                  </Text>
                </Pressable>

              </View>

            </View>

            {/* SETA */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={ROXO}
              style={styles.cardSeta}
            />

          </View>
        )}
      />

      {/* BARRA INFERIOR */}
      <View style={styles.barra}>

        <Pressable style={styles.barraItem}>
          <Ionicons
            name="home-outline"
            size={26}
            color="#55527A"
          />

          <Text style={styles.barraTexto}>
            Início
          </Text>
        </Pressable>

        <Pressable style={styles.barraItem}>
          <Ionicons
            name="briefcase"
            size={26}
            color={ROXO}
          />

          <Text style={styles.barraTextoAtivo}>
            Vagas
          </Text>

          <View style={styles.barraSublinhado} />
        </Pressable>

        <Pressable style={styles.barraItem}>
          <Ionicons
            name="people-outline"
            size={26}
            color="#55527A"
          />

          <Text style={styles.barraTexto}>
            Candidaturas
          </Text>
        </Pressable>

        <Pressable style={styles.barraItem}>
          <Ionicons
            name="settings-outline"
            size={26}
            color="#55527A"
          />

          <Text style={styles.barraTexto}>
            Configurações
          </Text>
        </Pressable>

      </View>

      {/* MODAL */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
      >
        <View style={styles.modalFundo}>

          <View style={styles.modalCaixa}>

            <Text style={styles.modalTitulo}>
              {editandoId === null
                ? "Nova vaga"
                : "Editar vaga"}
            </Text>

            <TextInput
              style={styles.modalCampo}
              placeholder="Título da vaga"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={styles.modalCampo}
              placeholder="Nome da empresa"
              value={empresa}
              onChangeText={setEmpresa}
            />

            <TextInput
              style={styles.modalCampo}
              placeholder="Cidade - UF"
              value={cidade}
              onChangeText={setCidade}
            />

            <TextInput
              style={styles.modalCampo}
              placeholder="Quantidade de vagas"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />

            <View style={styles.modalBotoes}>

              <Pressable
                onPress={() => setModalAberto(false)}
              >
                <Text style={styles.modalCancelar}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={styles.modalSalvar}
                onPress={salvarVaga}
              >
                <Text style={styles.modalSalvarTexto}>
                  Salvar vaga
                </Text>
              </Pressable>

            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
}


/* =========================================================
   CORES
========================================================= */

const ROXO = "#7B2FF7";
const ROXO_ESCURO = "#6420D6";
const ROXO_CLARO = "#ECE8FB";
const CINZA_CLARO = "#D9D9D9";

const MARINHO = "#1A1446";

const BORDA = "#E4E2F5";

const FUNDO_ROXO = "#7B2FF7";

const VERMELHO = "#D92D43";
const VERMELHO_CLARO = "#FDE8EB";

const BRANCO = "#FFFFFF";

const CINZA_TEXTO = "#6E6A9A";


/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({

  /* FUNDO PRINCIPAL */
  tela: {
    flex: 1,
    backgroundColor: FUNDO_ROXO,
  },

  lista: {
    paddingBottom: 24,
  },


  /* =====================================================
     TOPO BRANCO
  ===================================================== */

  cabecalho: {
    height: 105,

    backgroundColor: BRANCO,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 0,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  logo: {
    width: 200,
    height: 100,
    marginLeft: -34,
    marginRight: 0,
    alignSelf: "flex-start",
    left: 0,
  },

  avatar: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: ROXO,

    alignItems: "center",
    justifyContent: "center",
  },


  /* =====================================================
     CONTEÚDO ROXO
  ===================================================== */

  conteudoTopo: {
    backgroundColor: FUNDO_ROXO,

    paddingHorizontal: 20,

    paddingTop: 28,

    paddingBottom: 18,
  },

  titulo: {
    fontSize: 32,

    fontWeight: "800",

    color: "#F5B81C",

    marginTop: 4,
  },

  subtitulo: {
    fontSize: 15,

    lineHeight: 21,

    color: "rgba(255,255,255,0.90)",

    marginTop: 6,

    maxWidth: 320,
  },


  /* =====================================================
     BUSCA
  ===================================================== */

  busca: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    backgroundColor: CINZA_CLARO,

    borderRadius: 16,

    paddingHorizontal: 16,

    height: 52,

    marginTop: 22,

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.15)",
  },

  campoBusca: {
    flex: 1,

    fontSize: 16,

    color: "#000000",
  },


  /* =====================================================
     CONTADOR + ADICIONAR
  ===================================================== */

  linhaAcoes: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 20,

    marginBottom: 6,
  },

  contador: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    backgroundColor: ROXO_ESCURO,

    borderRadius: 22,

    paddingHorizontal: 16,

    height: 44,
  },

  contadorTexto: {
    color: BRANCO,

    fontWeight: "700",

    fontSize: 15,
  },

  botaoAdicionar: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    backgroundColor: BRANCO,

    borderRadius: 22,

    paddingHorizontal: 16,

    height: 44,
  },

  botaoAdicionarTexto: {
    color: ROXO,

    fontWeight: "700",

    fontSize: 15,
  },


  /* =====================================================
     CARDS
  ===================================================== */

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

    shadowOffset: {
      width: 0,
      height: 3,
    },

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
    flexDirection: "row",

    gap: 6,

    alignSelf: "flex-start",
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


  /* =====================================================
     RODAPÉ
  ===================================================== */

  barra: {
    flexDirection: "row",

    backgroundColor: BRANCO,

    borderTopWidth: 1,

    borderTopColor: BORDA,

    paddingTop: 10,

    paddingBottom: 16,
  },

  barraItem: {
    flex: 1,

    alignItems: "center",

    gap: 4,
  },

  barraTexto: {
    fontSize: 12,

    color: "#55527A",
  },

  barraTextoAtivo: {
    fontSize: 13,

    fontWeight: "800",

    color: ROXO,
  },

  barraSublinhado: {
    width: 56,

    height: 3,

    borderRadius: 2,

    backgroundColor: ROXO,

    marginTop: 2,
  },


  /* =====================================================
     MODAL
  ===================================================== */

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
  },

  modalTitulo: {
    fontSize: 18,

    fontWeight: "800",

    color: ROXO,

    marginBottom: 12,
  },

  modalCampo: {
    backgroundColor: ROXO_CLARO,

    borderRadius: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,

    marginBottom: 10,

    fontSize: 14,

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
    backgroundColor: ROXO,

    borderRadius: 16,

    paddingHorizontal: 18,

    paddingVertical: 8,
  },

  modalSalvarTexto: {
    color: BRANCO,

    fontWeight: "700",
  },

});