# 릴리즈 버전 태그 관리 방식

이 프로젝트는 플랫폼별로 분리된 git 태그로 릴리즈를 관리합니다. **Android는 태그 push가 곧 배포 트리거**이니 아래 규칙을 꼭 지켜주세요.

## 태그 형식

```
{platform}-v{versionName}+{versionCode}
```

| 예시 | 의미 |
|---|---|
| `android-v1.5.0+19` | Android, 버전명 1.5.0, versionCode 19 |
| `ios-v1.4.4+1` | iOS, 버전명 1.4.4, buildNumber 1 |

- `versionName` (`1.5.0`) : 스토어에 노출되는 사용자용 버전. `app.json`의 `expo.version`과 일치시킵니다.
- `versionCode` / `buildNumber` (`+19`, `+1`) : 스토어 내부 빌드 식별자. **같은 플랫폼 내에서 이전 값보다 항상 커야 합니다** (같거나 낮으면 스토어 업로드가 거부됩니다). 플랫폼별로 독립적으로 증가합니다 (Android 19번째 ≠ iOS 19번째).
- 태그 메시지 컨벤션: `"{Platform} release {versionName} (build {versionCode})"`
  예) `"Android release 1.5.0 (build 19)"`

> 과거에 `v1.4.2`처럼 플랫폼 접두어 없는 태그가 있었는데, 이건 레거시입니다. 새 태그는 반드시 `android-v*` / `ios-v*` 형식을 따라주세요.

## Android: 태그 push = 자동 배포

`android-v*` 형식의 태그를 push하면 `.github/workflows/android-release.yml`이 즉시 실행됩니다.

1. 태그 이름에서 버전 추출 (`android-v1.5.0+19` → `versionName=1.5.0`, `versionCode=19`)
2. AAB 빌드 (Fastlane, `android/fastlane/Fastfile`의 `internal` 레인)
3. **Google Play 내부 테스트(internal) 트랙에 자동 업로드**

즉, Android는 **태그를 push하는 순간이 실제 배포 시점**입니다. 준비 안 된 상태로 push하지 마세요. 되돌리려면 스토어 콘솔에서 별도 조치가 필요합니다.

## iOS: 태그는 기록용, 자동 배포 아님

iOS는 아직 CI 자동 배포가 없습니다. `ios-v*` 태그는 **수동으로 Xcode Archive → App Store Connect 업로드를 마친 뒤, 기록 목적으로만 다는 태그**입니다. 태그를 push해도 아무 워크플로우도 실행되지 않습니다.

## 릴리즈 절차

### Android
1. `app.json`의 `expo.version`(버전명)과 `android.versionCode`(있다면)를 새 버전으로 업데이트하는 커밋을 올림
2. 배포 준비가 끝난 커밋에 태그 생성
   ```bash
   git tag -a android-v{versionName}+{versionCode} -m "Android release {versionName} (build {versionCode})"
   git push origin android-v{versionName}+{versionCode}
   ```
3. GitHub Actions에서 `Android Release` 워크플로우가 도는지 확인 → Play Console 내부 테스트 트랙에 반영됐는지 확인

### iOS
1. `app.json`의 `expo.ios.buildNumber` / `expo.version` 업데이트
2. Xcode(또는 `eas build`)로 Archive → App Store Connect 업로드 (수동)
3. 업로드가 끝난 커밋에 기록용 태그 생성 & push
   ```bash
   git tag -a ios-v{versionName}+{buildNumber} -m "iOS release {versionName} (build {buildNumber})"
   git push origin ios-v{versionName}+{buildNumber}
   ```

## 주의사항

- `versionCode`/`buildNumber`는 절대 재사용하거나 낮추지 않기 (스토어가 거부함).
- 한 번 push한 릴리즈 태그는 삭제/재사용하지 않기 (이미 배포된 빌드와 태그가 어긋나면 추적이 어려워짐).
- 태그 생성 전에 `app.json`의 버전 정보와 태그 이름이 반드시 일치하는지 확인하기.
