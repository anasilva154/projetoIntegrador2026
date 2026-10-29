import { Children, cloneElement, isValidElement, useCallback, useRef, type ReactNode } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  type FlatListProps,
  type KeyboardAvoidingViewProps,
  type ScrollViewProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  children: ReactNode;
  delay?: number;
};

type ViewChildProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type TextChildProps = {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
};

type ScrollViewChildProps = ScrollViewProps & {
  children?: ReactNode;
};

type FlatListChildProps<ItemT> = FlatListProps<ItemT> & {
  style?: StyleProp<ViewStyle>;
};

type AnimacaoItemListaProps = {
  children: ReactNode;
  index: number;
  delay?: number;
};

type PositionedChildProps = {
  style?: StyleProp<ViewStyle>;
};

const AnimatedKeyboardAvoidingView =
  Animated.createAnimatedComponent(KeyboardAvoidingView);

const duracao = 360;
const intervalo = 65;
const maximoAtrasoItens = 10;

export function AnimacaoItemLista({ children, index, delay = 0 }: AnimacaoItemListaProps) {
  const valor = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      valor.setValue(0);
      const animacao = Animated.timing(valor, {
        toValue: 1,
        duration: duracao,
        delay: delay + Math.min(index, maximoAtrasoItens) * intervalo,
        useNativeDriver: Platform.OS !== 'web',
      });

      animacao.start();
      return () => animacao.stop();
    }, [delay, index, valor]),
  );

  return (
    <Animated.View
      style={{
        opacity: valor,
        transform: [
          {
            translateY: valor.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function animarListas(elemento: ReactNode, delay: number): ReactNode {
  if (!isValidElement(elemento)) {
    return elemento;
  }

  if (isValidElement<FlatListChildProps<unknown>>(elemento) && elemento.type === FlatList) {
    const renderItem = elemento.props.renderItem;

    return cloneElement(elemento, {
      renderItem: renderItem
        ? (info) => (
          <AnimacaoItemLista index={info.index} delay={delay}>
            {renderItem(info)}
          </AnimacaoItemLista>
        )
        : renderItem,
    });
  }

  if (isValidElement<ViewChildProps>(elemento) && elemento.type === View) {
    return cloneElement(elemento, undefined, Children.map(
      elemento.props.children,
      (child) => animarListas(child, delay),
    ));
  }

  if (isValidElement<ScrollViewChildProps>(elemento) && elemento.type === ScrollView) {
    return cloneElement(elemento, undefined, Children.map(
      elemento.props.children,
      (child) => animarListas(child, delay),
    ));
  }

  if (
    isValidElement<KeyboardAvoidingViewProps>(elemento) &&
    elemento.type === KeyboardAvoidingView
  ) {
    return cloneElement(elemento, undefined, Children.map(
      elemento.props.children,
      (child) => animarListas(child, delay),
    ));
  }

  return elemento;
}

export function AnimacaoConteudoPagina({ children, delay = 0 }: Props) {
  const elementos = Children.toArray(children);
  const valores = useRef<Animated.Value[]>([]);

  while (valores.current.length < elementos.length) {
    valores.current.push(new Animated.Value(0));
  }

  useFocusEffect(
    useCallback(() => {
      const animacoes = valores.current.slice(0, elementos.length).map((valor, indice) => {
        valor.setValue(0);
        return Animated.timing(valor, {
          toValue: 1,
          duration: duracao,
          delay: delay + indice * intervalo,
          useNativeDriver: Platform.OS !== 'web',
        });
      });

      const animacao = Animated.parallel(animacoes);
      animacao.start();

      return () => animacao.stop();
    }, [delay, elementos.length]),
  );

  return (
    <>
      {elementos.map((elemento, indice) => {
        const valor = valores.current[indice];
        const chave = isValidElement(elemento) && elemento.key !== null
          ? elemento.key
          : indice;

        if (isValidElement<FlatListChildProps<unknown>>(elemento) && elemento.type === FlatList) {
          return animarListas(elemento, delay);
        }

        const estiloAnimado = {
          opacity: valor,
          transform: [
            {
              translateY: valor.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        };

        if (isValidElement<ViewChildProps>(elemento) && elemento.type === View) {
          const { children: filhos, ...props } = elemento.props;

          return (
            <Animated.View
              key={chave}
              {...props}
              style={[props.style, estiloAnimado]}
            >
              {animarListas(filhos, delay)}
            </Animated.View>
          );
        }

        if (isValidElement<TextChildProps>(elemento) && elemento.type === Text) {
          return (
            <Animated.Text
              key={chave}
              {...elemento.props}
              style={[elemento.props.style, estiloAnimado]}
            />
          );
        }

        if (isValidElement<ScrollViewChildProps>(elemento) && elemento.type === ScrollView) {
          const { children: filhos, ...props } = elemento.props;

          return (
            <Animated.ScrollView
              key={chave}
              {...props}
              style={[props.style, estiloAnimado]}
            >
              {animarListas(filhos, delay)}
            </Animated.ScrollView>
          );
        }

        if (
          isValidElement<KeyboardAvoidingViewProps>(elemento) &&
          elemento.type === KeyboardAvoidingView
        ) {
          const { children: filhos, ...props } = elemento.props;

          return (
            <AnimatedKeyboardAvoidingView
              key={chave}
              {...props}
              style={[props.style, estiloAnimado]}
            >
              {animarListas(filhos, delay)}
            </AnimatedKeyboardAvoidingView>
          );
        }

        if (isValidElement<PositionedChildProps>(elemento)) {
          const estilo = typeof elemento.props.style === 'function'
            ? undefined
            : StyleSheet.flatten(elemento.props.style);

          if (estilo?.position === 'absolute') {
            const {
              position,
              top,
              right,
              bottom,
              left,
              zIndex,
              elevation,
              ...estiloFilho
            } = estilo;

            return (
              <Animated.View
                key={chave}
                style={[
                  { position, top, right, bottom, left, zIndex, elevation },
                  estiloAnimado,
                ]}
              >
                {cloneElement(elemento, { style: estiloFilho })}
              </Animated.View>
            );
          }
        }

        return (
          <Animated.View key={chave} style={estiloAnimado}>
            {animarListas(elemento, delay)}
          </Animated.View>
        );
      })}
    </>
  );
}
