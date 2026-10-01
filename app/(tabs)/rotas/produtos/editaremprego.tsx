import { useState } from "react";
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
  atividades: string[];
};

const VAGAS_INICIAIS: Vaga[] = [
  {
    id: 1,
    titulo: "Jovem Aprendiz / Auxiliar",
    empresa: "Nova Geração Soluções",
    atividades: [
      "Auxiliar na organização de documentos;",
      "Apoiar a equipe nas tarefas do dia a dia;",
      "Preencher planilhas e cadastrar informações;",
      "Auxiliar no atendimento ao cliente;",
      "Aprender novas atividades administrativas.",
    ],
  },
  {
    id: 2,
    titulo: "Jovem Aprendiz / Auxiliar",
    empresa: "Nova Geração Soluções",
    atividades: [
      "Auxiliar na organização de documentos;",
      "Apoiar a equipe nas tarefas do dia a dia;",
      "Preencher planilhas e cadastrar informações;",
      "Auxiliar no atendimento ao cliente;",
      "Aprender novas atividades administrativas.",
    ],
  },
];

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>(VAGAS_INICIAIS);
  const [busca, setBusca] = useState("");

  // formulário (serve para adicionar e para editar)
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [atividades, setAtividades] = useState("");

  const vagasFiltradas = vagas.filter((v) =>
    `${v.titulo} ${v.empresa}`.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirNovaVaga() {
    setEditandoId(null);
    setTitulo("");
    setEmpresa("");
    setAtividades("");
    setModalAberto(true);
  }

  function abrirEdicao(vaga: Vaga) {
    setEditandoId(vaga.id);
    setTitulo(vaga.titulo);
    setEmpresa(vaga.empresa);
    setAtividades(vaga.atividades.join("\n"));
    setModalAberto(true);
  }

  function salvarVaga() {
    if (!titulo.trim()) return;

    const lista = atividades
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);

    if (editandoId === null) {
      setVagas([
        ...vagas,
        { id: Date.now(), titulo: titulo.trim(), empresa: empresa.trim(), atividades: lista },
      ]);
    } else {
      setVagas(
        vagas.map((v) =>
          v.id === editandoId
            ? { ...v, titulo: titulo.trim(), empresa: empresa.trim(), atividades: lista }
            : v
        )
      );
    }
    setModalAberto(false);
  }

  function excluirVaga(id: number) {
    setVagas(vagas.filter((v) => v.id !== id));
  }

  return (
    <View style={styles.tela}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Image
          source={require("../../../../assets/images/vooa.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.perfil}>
          <Text style={styles.nomeEmpresa}>nome da empresa</Text>
          <View style={styles.avatar}>
            <View style={styles.avatarCabeca} />
            <View style={styles.avatarCorpo} />
          </View>
        </View>
      </View>

      {/* Painel roxo */}
      <View style={styles.painel}>
        <View style={styles.linhaBusca}>
          <TextInput
            style={styles.campoBusca}
            value={busca}
            onChangeText={setBusca}
          />
          <View style={styles.botaoRedondo}>
            <Text style={styles.iconeBusca}>🔍</Text>
          </View>
          <Pressable style={styles.botaoRedondo} onPress={abrirNovaVaga}>
            <Text style={styles.iconeMais}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.etiqueta}>Vagas disponíveis</Text>

        <FlatList
          data={vagasFiltradas}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                style={styles.botaoExcluir}
                onPress={() => excluirVaga(item.id)}
              >
                <Text style={styles.iconeExcluir}>−</Text>
              </Pressable>

              <Text style={styles.cardTitulo}>• {item.titulo}</Text>
              <Text style={styles.cardEmpresa}>{item.empresa}</Text>

              <View style={styles.cardDescricao}>
                {item.atividades.map((a, i) => (
                  <Text key={i} style={styles.atividade}>
                    • {a}
                  </Text>
                ))}
                <Pressable onPress={() => abrirEdicao(item)}>
                  <Text style={styles.editar}>Editar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>

      {/* Formulário de adicionar / editar */}
      <Modal visible={modalAberto} transparent animationType="fade">
        <View style={styles.modalFundo}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>
              {editandoId === null ? "Nova vaga" : "Editar vaga"}
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
              style={[styles.modalCampo, { height: 110, textAlignVertical: "top" }]}
              placeholder="Atividades (uma por linha)"
              value={atividades}
              onChangeText={setAtividades}
              multiline
            />

            <View style={styles.modalBotoes}>
              <Pressable onPress={() => setModalAberto(false)}>
                <Text style={styles.modalCancelar}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalSalvar} onPress={salvarVaga}>
                <Text style={styles.modalSalvarTexto}>Salvar vaga</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ROXO = "#7B2FF7";
const AMARELO = "#F5B81C";
const VERMELHO = "#C0242F";
const CINZA_FUNDO = "#EBEBEB";
const CINZA_CLARO = "#E0E0E0";
const CINZA_TEXTO = "#9A9A9A";

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CINZA_CLARO,
  },

  // cabeçalho
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CINZA_CLARO,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logo: {
    width: 160,
    height: 64,
  },
  perfil: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nomeEmpresa: {
    color: AMARELO,
    fontWeight: "700",
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ROXO,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  avatarCabeca: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: CINZA_CLARO,
    marginBottom: 2,
  },
  avatarCorpo: {
    width: 26,
    height: 14,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: CINZA_CLARO,
  },

  // painel roxo
  painel: {
    flex: 1,
    backgroundColor: ROXO,
    borderRadius: 36,
    marginHorizontal: 34,
    marginTop: 28,
    marginBottom: 28,
    paddingHorizontal: 12,
    paddingTop: 26,
  },
  linhaBusca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  campoBusca: {
    flex: 1,
    height: 32,
    backgroundColor: CINZA_CLARO,
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  botaoRedondo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: CINZA_CLARO,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeBusca: { fontSize: 14 },
  iconeMais: { fontSize: 24, color: "#777", lineHeight: 26, fontWeight: "700" },

  etiqueta: {
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 18,
    marginLeft: 4,
  },

  // cards
  card: {
    backgroundColor: CINZA_CLARO,
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 8,
    marginTop: 14,
  },
  botaoExcluir: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: VERMELHO,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconeExcluir: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "800",
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginLeft: 8,
  },
  cardEmpresa: {
    fontSize: 12,
    color: CINZA_TEXTO,
    marginLeft: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  cardDescricao: {
    backgroundColor: CINZA_FUNDO,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  atividade: {
    fontSize: 11,
    color: "#222",
    marginBottom: 2,
  },
  editar: {
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "700",
    color: CINZA_TEXTO,
    textDecorationLine: "underline",
    marginTop: 8,
  },

  // modal
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCaixa: {
    backgroundColor: CINZA_CLARO,
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
    backgroundColor: CINZA_FUNDO,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
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
    color: "#fff",
    fontWeight: "700",
  },
});