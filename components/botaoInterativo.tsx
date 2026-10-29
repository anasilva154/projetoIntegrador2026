import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type TouchableOpacityProps,
} from 'react-native';

type Props = PressableProps & Pick<TouchableOpacityProps, 'activeOpacity'>;

function escurecer(cor: unknown): string | undefined {
  if (typeof cor !== 'string') return undefined;

  const hex = cor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const expandido =
      hex[1].length === 3
        ? hex[1].split('').map((canal) => canal + canal).join('')
        : hex[1];
    const escurecido = expandido.match(/.{2}/g)?.map((canal) =>
      Math.round(parseInt(canal, 16) * 0.82)
        .toString(16)
        .padStart(2, '0'),
    );
    return escurecido ? `#${escurecido.join('')}` : undefined;
  }

  const rgb = cor.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgb) return undefined;

  const partes = rgb[1].split(',').map((parte) => parte.trim());
  if (partes.length < 3) return undefined;
  const canais = partes.slice(0, 3).map((parte) => {
    const percentual = parte.endsWith('%');
    const valor = Number.parseFloat(parte);
    if (!Number.isFinite(valor)) return null;
    return Math.max(0, Math.round((percentual ? valor * 2.55 : valor) * 0.82));
  });
  if (canais.some((canal) => canal === null)) return undefined;

  return partes.length === 4
    ? `rgba(${canais.join(', ')}, ${partes[3]})`
    : `rgb(${canais.join(', ')})`;
}

export function PressableComEfeito({
  style,
  activeOpacity = 0.78,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      style={(state) => {
        const estiloOriginal =
          typeof style === 'function' ? style(state) : style;
        const estilo = StyleSheet.flatten(estiloOriginal);
        const corBase = estilo?.backgroundColor;
        const corEscura = state.pressed ? escurecer(corBase) : undefined;
        const telaCheia =
          estilo?.position === 'absolute' &&
          estilo.top === 0 &&
          estilo.bottom === 0 &&
          estilo.left === 0 &&
          estilo.right === 0;

        return [
          estiloOriginal,
          {
            ...(!telaCheia && { borderRadius: estilo?.borderRadius ?? 999 }),
            ...(corEscura
              ? { backgroundColor: corEscura }
              : state.pressed
                ? { opacity: activeOpacity }
                  : {}),
            transform: state.pressed ? [{ scale: 0.97 }] : estilo?.transform,
          },
        ];
      }}
    />
  );
}

export function TouchableOpacityComEfeito(props: TouchableOpacityProps) {
  return <PressableComEfeito {...props} />;
}
