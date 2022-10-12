import React, {useEffect, useState} from 'react';
import {faker} from '@faker-js/faker';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  addListener,
  eventNames,
  openCardOnFileSwitcher,
  openSubscriptionCanceler,
} from 'react-native-knotapi';
import {useDispatch, useSelector} from 'react-redux';
import {login} from './store/actions';
import Config from 'react-native-config';

export default function App() {
  const [isCardSwitcherLoading, setIsCardSwitcherLoading] = useState(false);
  const [isSubscriptionCancelerLoading, setIsSubscriptionCancelerLoading] =
    useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('cardSwitcher');
  const dispatch = useDispatch();
  // @ts-ignore
  const {sessionId} = useSelector(state => state.auth);

  useEffect(() => {
    // @ts-ignore
    const listener = addListener(eventNames.onEvent, event => {
      console.log({event});
    });
    return () => {
      // @ts-ignore
      listener?.remove();
    };
  }, []);

  useEffect(() => {
    if (sessionId && buttonClicked) {
      setButtonClicked(false);
      onPressOpen();
    }
  }, [sessionId, buttonClicked]);

  const onPressOpen = () => {
    setButtonClicked(true);
    if (selectedProduct === 'subscriptionCanceler') {
      setIsSubscriptionCancelerLoading(true);
    }
    if (selectedProduct === 'cardSwitcher') {
      setIsCardSwitcherLoading(true);
    }
    const userData = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number('##########'),
      password: faker.internet.password(),
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      state: faker.address.stateAbbr(),
      city: faker.address.city(),
      postal_code: faker.address.zipCode(),
    };

    if (sessionId) {
      openKnotSDK();
    } else {
      dispatch(login(userData));
    }
  };

  const openKnotSDK = async () => {
    let customization = {
      primaryColor: '#5b138c',
      textColor: '#e0e0e0',
      companyName: 'Millions',
    };

    try {
      if (selectedProduct === 'cardSwitcher') {
        await openCardOnFileSwitcher({
          sessionId,
          clientId: Config.KNOTAPI_CLIENT_ID || '',
          environment:
            Config.KNOTAPI_ENVIRONMENT === 'production'
              ? 'production'
              : 'sandbox',
          customization,
        });
      }
      if (selectedProduct === 'subscriptionCanceler') {
        await openSubscriptionCanceler({
          sessionId,
          customization,
        });
      }
    } catch (e) {
      console.log({e});
    } finally {
      setIsSubscriptionCancelerLoading(false);
      setIsCardSwitcherLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setSelectedProduct('cardSwitcher');
          onPressOpen();
        }}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isCardSwitcherLoading ? 'Loading ...' : 'Open Card on file switcher'}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setSelectedProduct('subscriptionCanceler');
          onPressOpen();
        }}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isSubscriptionCancelerLoading
            ? 'Loading ...'
            : 'Open Subscription canceler'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#5b138c',
    padding: 16,
    width: '60%',
    alignItems: 'center',
    marginVertical: 8,
  },
  textButton: {
    color: '#fff',
  },
});
