const Notification = ({ notification }) => {
  const { message, isError } = notification
  const styles = {
    color: isError ? 'red' : 'green',
    padding: 10,
    backgroundColor: 'lightGrey',
    borderRadius: 10,
    border: isError ? '2px solid red' : '2px solid green',
    marginBottom: 10,
  }
  return (<div style={styles}>{message}</div>)
}

export default Notification