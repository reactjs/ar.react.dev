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
>>>>>>> ba290ad4e432f47a2a2f88d067dacaaa161b5200
