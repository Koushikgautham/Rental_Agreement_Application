import 'package:shared_preferences/shared_preferences.dart';

abstract class LocalStorage {
  Future<void> setString(String key, String value);
  Future<String?> getString(String key);
  Future<void> setBool(String key, bool value);
  Future<bool?> getBool(String key);
  Future<void> setInt(String key, int value);
  Future<int?> getInt(String key);
  Future<void> remove(String key);
  Future<void> clear();
}

class LocalStorageImpl implements LocalStorage {
  SharedPreferences? _prefs;
  
  Future<SharedPreferences> get prefs async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }
  
  @override
  Future<void> setString(String key, String value) async {
    final sp = await prefs;
    await sp.setString(key, value);
  }
  
  @override
  Future<String?> getString(String key) async {
    final sp = await prefs;
    return sp.getString(key);
  }
  
  @override
  Future<void> setBool(String key, bool value) async {
    final sp = await prefs;
    await sp.setBool(key, value);
  }
  
  @override
  Future<bool?> getBool(String key) async {
    final sp = await prefs;
    return sp.getBool(key);
  }
  
  @override
  Future<void> setInt(String key, int value) async {
    final sp = await prefs;
    await sp.setInt(key, value);
  }
  
  @override
  Future<int?> getInt(String key) async {
    final sp = await prefs;
    return sp.getInt(key);
  }
  
  @override
  Future<void> remove(String key) async {
    final sp = await prefs;
    await sp.remove(key);
  }
  
  @override
  Future<void> clear() async {
    final sp = await prefs;
    await sp.clear();
  }
}