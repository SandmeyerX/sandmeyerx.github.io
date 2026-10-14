---
author: Sandmeyer
pubDatetime: 2025-09-20T21:21:14.000+08:00
modDatetime: 
title: 使用 Flutter 构建鸿蒙应用
featured: false
draft: false
tags:
  - Flutter
  - 鸿蒙
  - 教程
description: 本文介绍了如何使用 FVM 安装支持鸿蒙的 Flutter SDK，并完成项目创建、签名与运行，帮助开发者快速搭建 HarmonyOS 上的 Flutter 开发环境。
---

## Table of contents

## 环境准备

>   [!NOTE]
>
>   本文假设你已经配置了 官方Flutter 和 HormonyOS 开发环境



### 安装 FVM

[**FVM**](https://fvm.app/)（Flutter Version Management）是一个 Flutter SDK 版本管理工具，它可以帮助我们轻松地管理和切换不同版本的 Flutter SDK

使用 dart 包管理器安装：

```sh
dart pub global activate fvm
```

安装成功后会输出类似：

```sh
+ args 2.7.0
+ async 2.13.0
+ boolean_selector 2.1.2
+ characters 1.4.1
+ cli_completion 0.5.0 (0.5.1 available)
+ clock 1.1.2
+ collection 1.19.1
...
+ yaml 3.1.3
Building package executables...
Built fvm:compile.
Built fvm:main.
Installed executable fvm.
Activated fvm 3.2.1.

```

输入以下命令查看使用 FVM 安装过的 Flutter 列表：

```sh
fvm list
```

输出：

```sh
Cache directory:  C:\Users\foo\fvm\versions
Directory Size: 0 B

No SDKs have been installed yet. Flutter. SDKs
installed outside of fvm will not be displayed.

```

**注意：未使用 FVM 安装的 Flutter 不会出现在列表中**

可以看到，默认情况下，不同版本的 Flutter 安装在`C:\Users\你的用户名\fvm\versions`，我们可以使用以下命令修改安装位置：

```sh
fvm config --cache-path D:\dev\Fvm\
```

**注意：不要在`D:\dev\Fvm\`末尾添加`versions`，因为 FVM 会自动在配置路径后添加`versions`作为存储路径**

输出：

```sh
Setting cache-path to: D:\dev\Fvm\
AppConfig(disableUpdateCheck: null, lastUpdateCheck: null, cachePath: D:\dev\Fvm\, useGitCache: null, gitCachePath: null, flutterUrl: null, privilegedAccess: null, runPubGetOnSdkChanges: null, updateVscodeSettings: null, updateGitIgnore: null)

✓ Settings saved. (5ms)

```

### 安装支持鸿蒙的 Flutter

#### 克隆 Flutter 3.27.4 仓库

在配置的安装路径下（这里是`D:\dev\Fvm\versions`），输入以下命令从仓库获取**支持鸿蒙的** Flutter，这里使用 **Flutter 3.27.4** 版本：

```sh
git clone --branch oh-3.27.4-dev https://gitcode.com/openharmony-tpc/flutter_flutter.git ohos_3.27.4
```

如果是第一次连接 gitcode，会提示缺少认证文件，询问是否自动生成并连接：

```sh
Cloning into 'ohos_3.27.4'...
The authenticity of host 'gitcode.com (116.205.2.91)' can't be established.
RSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxx.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入`yes`后回车执行：

```sh

Cloning into 'ohos_3.27.4'...
remote: Enumerating objects: 1007427, done.
remote: Counting objects: 100% (14931/14931), done.
remote: Compressing objects: 100% (768/768), done.
remote: Total 1007427 (delta 14544), reused 14160 (delta 14160), pack-reused 992496 (from 1)
Receiving objects: 100% (1007427/1007427), 1.80 GiB | 38.36 MiB/s, done.
Resolving deltas: 100% (711599/711599), done.
Updating files: 100% (9024/9024), done.
```

#### 查看 Flutter 版本

完成后，使用 `fvm list` 命令查看已安装的 Flutter 版本：

```sh
$ fvm list
Cache directory:  D:\dev\Fvm\versions
Directory Size: 2.09 GB

┌─────────────┬─────────┬─────────────────┬──────────────┬──────────────┬────────┬───────┐
│ Version     │ Channel │ Flutter Version │ Dart Version │ Release Date │ Global │ Local │
├─────────────┼─────────┼─────────────────┼──────────────┼──────────────┼────────┼───────┤
│ ohos_3.27.4 │         │ Need setup      │              │              │        │       │
└─────────────┴─────────┴─────────────────┴──────────────┴──────────────┴────────┴───────┘

```

#### **使用 Flutter 3.27.4**

**切换到项目根目录下**，运行以下命令使用刚刚安装的 Flutter SDK：

```sh
fvm use ohos_3.27.4
```

一路 `yes` 即可：

```sh
┌───────────────────────────────────────────────────────────┐
│ ⚠ Flutter SDK: (ohos_3.27.4) is not valid Flutter version │
└───────────────────────────────────────────────────────────┘
✔ Do you want to continue? · yes


No pubspec.yaml detected in this directory
✔ Would you like to continue? · yes
Setting up Flutter SDK: ohos_3.27.4

Checking Dart SDK version...
Downloading Dart SDK from Flutter engine ...
dart-sdk-url: https://flutter-ohos.obs.cn-south-1.myhuaweicloud.com/flutter_infra_release/flutter/1dc755c1fdbb25ec97144cc5356d1b6a2684b040/dart-sdk-windows-x64.zip
Expanding downloaded archive with PowerShell...
Building flutter tool...
Running pub upgrade...
Resolving dependencies... (2.1s)
Downloading packages...
...
Got dependencies.
Flutter 3.27.5-ohos-1.0.0 • channel [user-branch] • https://gitcode.com/openharmony-tpc/flutter_flutter.git
Framework • revision dc6280c572 (2 days ago) • 2025-09-18 20:31:08 +0800
Engine • revision e672b006cb
Tools • Dart 3.6.2 • DevTools 2.40.0

✓ Flutter SDK: SDK Version : ohos_3.27.4 is setup
[WARN] Project is not a git repository.
 But will set .gitignore as IDEs may use it,to determine what to index and display on searches,
You should add the fvm version directory ".fvm/" to .gitignore.
✔ Would you like to do that now? · yes
✓ Added .fvm/ to .gitignore

Skipping "pub get" because no pubspec.yaml found.

✓ Project now uses Flutter SDK : SDK Version : ohos_3.27.4

```

### 创建 Flutter 项目

运行以下命令创建一个新的 Flutter 项目：

```sh
fvm flutter create your_project
```

这里警告 `“检测到版本不匹配：缓存版本为3.27.5-ohos-1.0.0，但预期版本为ohos_3.27.4”`，选择第一种处理方法：`“将3.27.5-ohos-1.0.0移动到正确的缓存目录，然后重新安装ohos_3.27.4”`（`Move 3.27.5-ohos-1.0.0 to the correct cache directory and reinstall ohos_3.27.4`）：

```
┌───────────────────────────────────────────────────────────┐
│ ⚠ Flutter SDK: (ohos_3.27.4) is not valid Flutter version │
└───────────────────────────────────────────────────────────┘
✔ Do you want to continue? · yes

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚠ Version mismatch detected: cache version is 3.27.5-ohos-1.0.0, but expected ohos_3.27.4. │
└────────────────────────────────────────────────────────────────────────────────────────────┘
This can occur if you manually run "flutter upgrade" on a cached SDK.

✔ How would you like to resolve this? · Move 3.27.5-ohos-1.0.0 to the correct cache directory and reinstall ohos_3.27.4
Moving SDK to the correct cache directory...
Removing incorrect SDK version...
┌───────────────────────────────────────────────────────────┐
│ ⚠ Flutter SDK: (ohos_3.27.4) is not valid Flutter version │
└───────────────────────────────────────────────────────────┘
✔ Do you want to continue? · yes

✗ Failed to install ohos_3.27.4 (0.7s)
✗ Failed to ensure ohos_3.27.4 is cached.
✗ Failed to ensure ohos_3.27.4 is cached.

ProcessException: Cloning into 'D:\dev\Fvm\versions\ohos_3.27.4'...
fatal: Remote branch ohos_3.27.4 not found in upstream origin
  Command: git clone --progress -c advice.detachedHead=false -b ohos_3.27.4 --reference D:\dev\Fvm\cache.git https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git D:\dev\Fvm\versions\ohos_3.27.4


```

此时，我们原先的 Flutter 环境名被修改成了 `3.27.5-ohos-1.0.0`

忽略后面的报错，然后重新打开终端运行命令：

```sh
fvm use  3.27.5-ohos-1.0.0
```

创建项目：

```sh
fvm flutter create your_project
```

如果不出意外，这里就不会报错了：

```sh
┌─────────────────────────────────────────────────────────────────┐
│ ⚠ Flutter SDK: (3.27.5-ohos-1.0.0) is not valid Flutter version │
└─────────────────────────────────────────────────────────────────┘
✔ Do you want to continue? · yes

Flutter assets will be downloaded from https://mirrors.tuna.tsinghua.edu.cn/flutter. Make sure you trust this source!
Creating project countdown_days...
Resolving dependencies in `countdown_days`... (4.5s)
Downloading packages...
Got dependencies in `countdown_days`.
Wrote 164 files.

All done!
You can find general documentation for Flutter at: https://docs.flutter.dev/
Detailed API documentation is available at: https://api.flutter.dev/
If you prefer video documentation, consider: https://www.youtube.com/c/flutterdev

In order to run your application, type:

  $ cd countdown_days
  $ flutter run

Your application code is in countdown_days\lib\main.dart.


```

### 签名

在运行项目之前，我们要先对项目进行签名，否则在运行过程中会出现错误如下：

```sh
请通过DevEco Studio打开ohos工程后配置调试签名(File -> Project Structure -> Signing Configs 勾选Automatically generate signature)
```

切换到创建的项目文件夹下，连接鸿蒙模拟器/真机，用 DevEco Studio 打开项目的 `ohos` 目录，在顶部菜单里依次点击 `File - Project Structure`，在 `Signing Configs` 页面使用自动签名（首次使用需要先登陆华为开发者账户）

如果出现错误：

```sh
The signature does not take effect or has expired. It may be the current system time is inaccurate, please calibrate the system time and sign again
```

说明需要同步主机的时间，在 `设置 - 时间和语言 - 日期和时间` 页面，点击 `立即同步` ，再重试即可

### 运行 Flutter 项目

看到这里，恭喜你已经成功配置好适配鸿蒙系统的 Flutter 开发环境了~

运行 `fvm flutter run` 查看这个无比熟悉的 Demo:

![Run flutter app](@/assets/images/build-ohos-with-flutter.png)

### Flutter 第三方库鸿蒙适配计划

[Flutter三方库适配计划](https://docs.qq.com/sheet/DVVJDWWt1V09zUFN2?tab=BB08J2)