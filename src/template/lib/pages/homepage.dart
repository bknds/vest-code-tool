import 'package:flutter/material.dart';

class {{MIX_NAME}}MyHomePage extends StatefulWidget {
  const {{MIX_NAME}}MyHomePage({Key? key}) : super(key: key);
  @override
  _{{MIX_NAME}}MyHomePageState createState() => _{{MIX_NAME}}MyHomePageState();
}

class _{{MIX_NAME}}MyHomePageState extends State<{{MIX_NAME}}MyHomePage> {
  const {{MIX_NAME}}asasd = '测试文字'
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Container(child:Text({{MIX_NAME}}asasd)),
    );
  }
}
