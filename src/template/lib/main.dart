import 'package:flutter/material.dart';
import 'package:{{PROJECT_NAME}}/{{MIX_NAME}}pages/{{MIX_NAME}}homepage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: '章鱼数字拼图',
      home: const {{MIX_NAME}}MyHomePage(),
    );
  }
}
