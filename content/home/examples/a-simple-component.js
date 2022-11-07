class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div dir="rtl">
        مرحبا {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="أحمد" />,
  document.getElementById('hello-example')
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
