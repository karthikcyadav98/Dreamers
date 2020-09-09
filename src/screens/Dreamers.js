import React, {useState, useEffect} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Keyboard,
	FlatList,
	Dimensions,
	Image,
	KeyboardAvoidingView,
	ActivityIndicator
} from 'react-native';
import {base_url} from '../apis/Apis';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Dreamers = () => {
	const [username, setUsername] = useState('');
	const [dream, setDream] = useState('');
	const [data, setData] = useState([]);
	const [appLoad, setAppLoad] = useState(true);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		axios
			.get(base_url)
			.then(response => {
				const arr = response.data.reverse();
				setData(arr);
				setAppLoad(false);
			})
			.catch(e => {
				alert('something went wrong');
				console.log('something went wrong', e);
			});
	}, []);

	const handelSubmit = () => {
		setLoading(true);
		if (username !== '' && dream !== '') {
			const insertData = {
				username: username,
				dream: dream
			};
			axios
				.post(base_url + '/add', insertData)
				.then(response => {
					setUsername('');
					setDream('');
					axios
						.get(base_url)
						.then(response => {
							const arr = response.data.reverse();
							setData(arr);
							setUsername('');
							setDream('');
							setLoading(false);
						})
						.catch(e => {
							alert('something went wrong');
							console.log('something went wrong', e);
						});
				})
				.catch(e => {
					alert('something went wrong');
					console.log('something went wrong', e);
				});
		} else {
			alert('Fields cannot be blank');
		}
	};

	const handelDelete = id => {
		setLoading(true);
		console.log('id ', id);
		axios
			.delete(base_url + '/' + id)
			.then(response => {
				alert('Delete Successful');
				axios
					.get(base_url)
					.then(response => {
						const arr = response.data.reverse();
						setData(arr);
						setUsername('');
						setDream('');
						setLoading(false);
					})
					.catch(e => {
						alert('something went wrong');
						console.log('something went wrong', e);
					});
			})
			.catch(e => {
				alert('something went wrong');
				console.log(e);
			});
	};

	const handleRefresh = () => {
		setRefreshing(true);
		axios
			.get(base_url)
			.then(response => {
				const arr = response.data.reverse();
				setData(arr);
				setRefreshing(false);
			})
			.catch(e => {
				alert('something went wrong');
				console.log('something went wrong', e);
			});
	};
	return (
		<View style={{flex: 1}}>
			{appLoad ? (
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<ActivityIndicator size="large" color="#383a4d" />
				</View>
			) : (
				<View style={{flex: 1}}>
					<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
						<View style={{flex: 1}}>
							<View style={styles.header}>
								<Text style={styles.headerText}>Dreamers App</Text>
							</View>
							<View style={styles.container}>
								<View
									style={[
										styles.textLayout,
										{
											height: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.06 : SCREEN_HEIGHT * 0.07,
											justifyContent: 'center'
										}
									]}
								>
									<TextInput
										value={username}
										onChangeText={text => setUsername(text)}
										style={styles.textInput}
										placeholder="Enter Your Name"
									/>
								</View>
								<View style={[styles.textLayout, {height: SCREEN_HEIGHT * 0.2, marginTop: 10}]}>
									<TextInput
										value={dream}
										onChangeText={text => setDream(text)}
										multiline={true}
										style={[styles.textInput, {marginTop: 10}]}
										placeholder="Enter Your Dream..."
									/>
								</View>
								<View style={styles.btnView}>
									{loading ? (
										<View style={styles.btnTouch}>
											<ActivityIndicator size="large" color="white" />
										</View>
									) : (
										<TouchableOpacity onPress={() => handelSubmit()} style={styles.btnTouch}>
											<Text style={styles.btnText}>Submit</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>

					<KeyboardAvoidingView behavior="height" style={{flex: 1}}>
						<View style={styles.container}>
							<FlatList
								keyExtractor={item => item._id}
								data={data}
								refreshing={refreshing}
								onRefresh={() => {
									handleRefresh();
								}}
								renderItem={({item}) => (
									<View
										style={{
											padding: 15,
											// flex: 1,
											flexDirection: 'row',
											// width: SCREEN_WIDTH * 0.88,
											borderWidth: 1,
											borderColor: 'black',
											textAlign: 'left'
										}}
									>
										<Text style={{width: SCREEN_WIDTH * 0.5}}>{item.fdream}</Text>
										<Text style={{width: SCREEN_WIDTH * 0.25}}>{item.fusername}</Text>
										<TouchableOpacity onPress={() => handelDelete(item._id)}>
											<Image
												style={{
													width: SCREEN_WIDTH * 0.05,
													height:
														Platform.OS === 'ios'
															? SCREEN_HEIGHT * 0.025
															: SCREEN_HEIGHT * 0.03
												}}
												source={require('../assets/trash.jpg')}
											/>
										</TouchableOpacity>
									</View>
								)}
							/>
						</View>
					</KeyboardAvoidingView>
				</View>
			)}
		</View>
	);
};

export default Dreamers;

const styles = StyleSheet.create({
	header: {
		height: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.1 : SCREEN_HEIGHT * 0.07,
		justifyContent: 'center',
		alignItems: 'flex-end',
		flexDirection: 'row',
		backgroundColor: '#383A4D'
	},
	headerText: {
		marginBottom: Platform.OS === 'ios' ? 20 : 15,
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20
	},
	container: {
		flex: 1,
		margin: 20
	},
	textLayout: {
		borderWidth: 1,
		borderColor: '#383a4d',
		// justifyContent: 'center',
		borderRadius: 10
	},
	textInput: {
		fontSize: 20,
		marginLeft: 10
	},
	btnView: {
		marginTop: 20,
		height: SCREEN_HEIGHT * 0.05,
		alignItems: 'flex-end'
	},
	btnTouch: {
		backgroundColor: '#383a4d',
		height: SCREEN_HEIGHT * 0.05,
		width: SCREEN_WIDTH * 0.3,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10
	},
	btnText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20
	}
});
